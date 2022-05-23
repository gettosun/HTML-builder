const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

const originPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

async function copyAll(origin, copy) {
  await fsPromises.rm(copy, { force: true, recursive: true });
  await fsPromises.mkdir(copy, { recursive: true });
  const originMap = await fsPromises.readdir(origin, {withFileTypes: true});

  for(let i of originMap) {
    const subOrigin = `${origin}/${i.name}`;
    const subCopy = `${copy}/${i.name}`;

    if(i.isDirectory()) {
      await fsPromises.mkdir(subCopy, { recursive: true });
      await copyAll(subOrigin, subCopy);
    } else if(i.isFile()) {
      await fsPromises.copyFile(subOrigin, subCopy);
    }
  }
    
}

copyAll(originPath, copyPath);