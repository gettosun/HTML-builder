const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function getBundle(dir) {
  const dirMap = await fsPromises.readdir(dir, {withFileTypes: true});
  const filtered = dirMap.filter(i => (i.isFile() && /\.css$/.test(i.name))).map(i => path.join(dir, i.name));
  let bundleArr = [];

  for(let i of filtered) {
    const bundleChunk = await fsPromises.readFile(i, 'utf8');
    bundleArr.push(`${bundleChunk}\n`);
  }
  
  await fsPromises.writeFile(bundlePath, bundleArr);
}
getBundle(stylesPath);