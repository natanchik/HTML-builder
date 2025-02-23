const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

// HTML block

const componentsPath = path.join(__dirname, 'components');
const htmlPathTo = path.join(__dirname, 'project-dist');

async function changeHtml(componentsPath, htmlPathTo) {
  fsPromises.mkdir(htmlPathTo, { recursive: true }).then(() => {
    fsPromises.readFile(path.join(__dirname, 'template.html')).then((data) => { // read html
      let newHtml = data.toString();
      fsPromises.readdir(componentsPath).then((files) => { // get list of components
        for (const file of files) {    
          const fileName = path.parse(file);
          let re = new RegExp('{{' + fileName.name + '}}', 'g');
          const readComponent = fs.createReadStream(path.join(componentsPath, file));          
          readComponent.on('data', (data) => {   
            newHtml = newHtml.replace(re, data.toString());   
            fs.writeFile(path.join(htmlPathTo, 'index.html'), newHtml, (err) => { if (err) throw err; });         
          });
        }
      });      
    });
  });
}

changeHtml(componentsPath, htmlPathTo)

// Assets block

const assetsPathFrom = path.join(__dirname, 'assets');
const assetsPathTo = path.join(__dirname, 'project-dist', 'assets');

function addFiles(pathFrom, pathTo) {
  fsPromises.rm(pathTo, { force: true, recursive: true }).then(() => { // remove folder
    fsPromises.mkdir(pathTo, { recursive: true }).then(() => { // add new folder
      fs.readdir(pathFrom, (err, files) => { // Get the list of files and folders
        if (err) throw err;
        for (const file of files) { // Go by the list of files
          fsPromises.stat(path.join(pathFrom, file)) // Get info about file or folder
            .then((stats) => {
              if (stats.isFile()) {
                fs.copyFile(path.join(pathFrom, file), path.join(pathTo, file), (err) => {
                  if (err) throw err;
                });
              } if (stats.isDirectory()) {
                const newPathTo = path.join(pathTo, file);
                const newPathFrom = path.join(pathFrom, file);
                addFiles(newPathFrom, newPathTo); // start new loop
              }
            });
        }
      });
    });
  });
}

addFiles(assetsPathFrom, assetsPathTo);

// Style block

const stylePathFrom = path.join(__dirname, 'styles');
const stylePathTo = path.join(__dirname, 'project-dist', 'style.css');
const styleWriteStream = fs.createWriteStream(stylePathTo);

function bundleFiles(pathFrom, pathTo) {
  fsPromises.writeFile(pathTo, '').then(() => { // create empty bundle.css
    fs.readdir(pathFrom, (err, files) => { // Get the list of style files
      if (err) throw err;
      for (const file of files) { // Go by the list of files
        const filePath = path.join(pathFrom, file);
        fsPromises.stat(filePath) // Get info about file
          .then((stats) => {
            if (stats.isFile() && path.extname(filePath) === '.css') {
              const readStyle = fs.createReadStream(filePath);
              readStyle.on('data', (data) => styleWriteStream.write(data));
            }
          });
      }
    });
  });
}

bundleFiles(stylePathFrom, stylePathTo);
