const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

const wrStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

rl.write('Hello, please type something:\n');
rl.on('line', (data) => {
  if (data === 'exit'){
    process.exit();
  }
  wrStream.write(`${data}\n`);
});

rl.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  console.log('Thank you, good bye');
});