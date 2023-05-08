const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

let pathFrom = path.join(__dirname, 'files');
let pathTo = path.join(__dirname, 'files-copy');

//let rmDir = fsPromises.rm(pathTo, { force: true, recursive: true }, (err) => { if (err) throw err });              

function addFiles(pathFrom, pathTo) { // Take the list of files
  fsPromises.mkdir(pathTo, { recursive: true }).then(() => {
    fs.readdir(pathFrom, (err, files) => {          // Get the list of files and folders
      if (err) throw err;           
      for (let file of files) {                               // Go by the list of files
        fsPromises.stat(path.join(pathFrom, file))      // Get info about file or folder
          .then((stats) => {
            if (stats.isFile()) {
              fs.copyFile(path.join(pathFrom, file), path.join(pathTo, file), (err) => {
                if (err) throw err;
              });
            } if (stats.isDirectory()) {    
              let newPathTo = path.join(pathTo, file); 
              let newPathFrom = path.join(pathFrom, file); 
              addFiles(newPathFrom, newPathTo)                         // start new loop
            }
          });
      }
    })
  })  
}

//rmDir.then(() => 
addFiles(pathFrom, pathTo);

// dir -> list of elemetns -> loop with create elements -> if dir
