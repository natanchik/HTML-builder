const path = require('path');
const fs = require('fs');

const { stdin, stdout, exit } = process;

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write("Hello! Input some information. For exit input 'Exit' or 'Crl + C'");

stdin.on('data', (chunk) => {
  if (chunk.toString().toLowerCase().includes('exit')) {
    exit(0);
  } else {
    writeStream.write(chunk);
  }
});

process.on('SIGINT', () => {
  exit(0);
});

process.on('exit', () => stdout.write('Goodbuy!'));
