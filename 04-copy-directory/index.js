const path = require('path');
const fsPromises = require('fs').promises;

const folder = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

fsPromises.mkdir(folderCopy, { recursive: true });

async function makeCopy(folder, folderCopy) {
  for (let file of await fsPromises.readdir(folderCopy)){
    fsPromises.rm(path.join(folderCopy, file));
  }
  for  (let file of  await fsPromises.readdir(folder)) {
    await fsPromises.copyFile(path.join(folder,file),  path.join(folderCopy, file));
  }
};

makeCopy(folder, folderCopy);