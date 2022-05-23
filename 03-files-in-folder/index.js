const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const dirPath = path.join(__dirname, 'secret-folder');

async function getFilesInfo(dir) {
  const dirMap = await fsPromises.readdir(dir, {withFileTypes: true});
  let filePath;
    
  for(let i of dirMap) {
    const next = `${dir}/${i.name}`;
    if(i.isDirectory()) {
      getFilesInfo(next);
    } else {
      filePath = `${dir}/${i.name}`;
      const fileName = path.basename(filePath, path.extname(filePath));
      const fileExtens = path.extname(filePath).slice(1);
      const filseSize = fs.statSync(filePath).size / 8;
      console.log(`${fileName} - ${fileExtens} - ${filseSize}kb`);
    }
  }
}
getFilesInfo(dirPath);