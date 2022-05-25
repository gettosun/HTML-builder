const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const dirPath = path.join(__dirname, 'secret-folder');

async function getFilesInfo(dir) {
  const dirMap = await fsPromises.readdir(dir, {withFileTypes: true});
  const filtered = dirMap.filter(i => i.isFile());
  let filePath;
    
  for(let i of filtered) {
    
    filePath = `${dir}/${i.name}`;
    const fileName = path.basename(filePath, path.extname(filePath));
    const fileExtens = path.extname(filePath).slice(1);
    const filseSize = await fsPromises.stat(filePath);
    console.log(`${fileName} - ${fileExtens} - ${filseSize.size / 8}kb`);
    
  }
}
getFilesInfo(dirPath);