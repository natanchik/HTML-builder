const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

const pathFrom = path.join(__dirname, 'styles');
const pathTo = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(pathTo);

function bundleFiles(pathFrom, pathTo) {
  fsPromises.writeFile(pathTo, '').then(() => {       // create empty bundle.css
    fs.readdir(pathFrom, (err, files) => {        // Get the list of style files
      if (err) throw err;
      for (const file of files) {                     // Go by the list of files
        const filePath = path.join(pathFrom, file);
        fsPromises.stat(filePath)                         // Get info about file
          .then((stats) => {
            if (stats.isFile() && path.extname(filePath) === '.css') {
              const readStyle = fs.createReadStream(filePath);
              readStyle.on('data', (data) => writeStream.write(data));
            }
          });
      }
    });
  });
}

bundleFiles(pathFrom, pathTo);
