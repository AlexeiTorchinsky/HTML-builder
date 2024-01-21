const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

async function buildPage() {
  const projectDist = path.join(__dirname, 'project-dist');
  await fsPromises.mkdir(projectDist, { recursive: true });

  async function createIndexHtml() {
    const htmlFiles = await fsPromises.readdir(
      path.join(__dirname, 'components'),
    );
    // console.log(htmlFiles)
    const indexHtml = path.join(__dirname, 'project-dist', 'index.html');
    const templateHtml = path.join(__dirname, 'template.html');
    let indexHtmlContent = await fsPromises.readFile(templateHtml, 'utf8');

    for (let file of htmlFiles) {
      let filePath = path.join(__dirname, 'components', `${file}`);
      let fileName = file.replace(/\.[^/.]+$/, '');
      const content = await fsPromises.readFile(filePath, 'utf8');
      indexHtmlContent = indexHtmlContent.replace(`{{${fileName}}}`, content);
    }
    await fsPromises.writeFile(indexHtml, indexHtmlContent);
  }

  createIndexHtml();

  async function createStyleCss() {
    const stylesFolder = path.join(__dirname, 'styles');
    const styleCss = path.join(__dirname, 'project-dist', 'style.css');
    const cssFiles = await fsPromises.readdir(stylesFolder);

    const contents = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(stylesFolder, file);
        return await fsPromises.readFile(filePath, 'utf-8');
      }),
    );
    const mergedContents = contents.join('\n');
    await fs.promises.writeFile(styleCss, mergedContents);
  }
  createStyleCss();

  async function copyAssets() {
    const assetsToCopy = path.join(__dirname, 'assets');
    const assetsCopied = path.join(__dirname, 'project-dist', 'assets');

    await fsPromises.mkdir(assetsCopied, { recursive: true });

    async function copyFolder(srcPath, destPath) {
      const files = await fsPromises.readdir(srcPath);
      for (const file of files) {
        const srcFilePath = path.join(srcPath, file);
        const destFilePath = path.join(destPath, file);
        const fileStat = await fsPromises.stat(srcFilePath);
        if (fileStat.isFile()) {
          await fsPromises.copyFile(srcFilePath, destFilePath);
        } else if (fileStat.isDirectory()) {
          await fsPromises.mkdir(destFilePath, { recursive: true });
          await copyFolder(srcFilePath, destFilePath);
        }
      }
    }

    await copyFolder(assetsToCopy, assetsCopied);
  }
  copyAssets();
}

buildPage();
