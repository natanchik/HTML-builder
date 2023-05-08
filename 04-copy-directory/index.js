const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

const pathFrom = path.join(__dirname, 'files');
const pathTo = path.join(__dirname, 'files-copy');

function copyDir(pathFrom, pathTo) {                           
  fsPromises.rm(pathTo, { force: true, recursive: true }).then(() => {    // remove folder
    fsPromises.mkdir(pathTo, { recursive: true }).then(() => {           // add new folder
      fs.readdir(pathFrom, (err, files) => {          // Get the list of files and folders
        if (err) throw err;           
        for (const file of files) {                             // Go by the list of files
          fsPromises.stat(path.join(pathFrom, file))      // Get info about file or folder
            .then((stats) => {
              if (stats.isFile()) {
                fs.copyFile(path.join(pathFrom, file), path.join(pathTo, file), (err) => {
                  if (err) throw err;
                });
              } if (stats.isDirectory()) {    
                const newPathTo = path.join(pathTo, file); 
                const newPathFrom = path.join(pathFrom, file); 
                addFiles(newPathFrom, newPathTo);                        // start new loop
              }
            });
        }
      });
    });
  });
}

copyDir(pathFrom, pathTo);

// dir -> list of elemetns -> loop with create elements -> if dir
