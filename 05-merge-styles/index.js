const path = require('path');
const fsPromises = require('fs').promises;

const stylesFolder =  path.join(__dirname, 'styles');
const bundlerFolder = path.join(__dirname, 'project-dist', 'bundle.css');
let styleArr = [];

async function mergeStyles() {
    
  const stylesFolderRead =  await fsPromises.readdir(stylesFolder);
  for (let file of stylesFolderRead) {
    if  (path.extname(file) === '.css') {
      let fileContent =  await fsPromises.readFile(path.join(stylesFolder, file));  
      styleArr.push(fileContent);
    } 
  } 
  await fsPromises.writeFile(bundlerFolder, styleArr);
};
mergeStyles();