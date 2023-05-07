const path = require('path');
const fs = require('fs/promises');

const { stdout } = process;

const files = fs.readdir(path.join(__dirname, 'secret-folder'));

files.then((elements) => {
  for (const file of elements) {
    fs.stat(path.join(__dirname, 'secret-folder', file))
      .then((stats) => {
        if (stats.isFile()) {
          const fileName = path.parse(file);
          stdout.write(fileName.name);
          stdout.write(' - ');
          stdout.write(fileName.ext.slice(1));
          stdout.write(' - ');
          stdout.write((stats.size / 1000).toString()); // в 1 киЛОбайте - 1000 байт, в 1 киБИбайте - 1024 байт
          stdout.write('kb');
          stdout.write('\n');
        }
      });
  }
});
