const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const projectDir = path.join(__dirname, 'project-dist');


async function projectBundle(dir) {
  const template = await fsPromises.readFile(path.join(dir, 'template.html'), 'utf8');
  const stylesPath = path.join(__dirname, 'styles');
  const originPath = path.join(__dirname, 'assets');
  const copyPath = path.join(__dirname, 'project-dist', 'assets');

  fromTemplate(template);
  getBundle(stylesPath);
  copyDir(originPath, copyPath);
}

async function fromTemplate(template) {
  const componentsList = await fsPromises.readdir(path.join(__dirname, 'components'));
  const filteredComponentList = componentsList.filter(i => i.includes('html')).map(i => i.slice(0, -5));
  let temp = template;

  for(let item of filteredComponentList) {
    const itemPath = path.join(__dirname, 'components', `${item}.html`);
    const itemContent = await fsPromises.readFile(itemPath, 'utf8');
    const subStr = new RegExp(`{{${item}}}`, 'gi');
    const newTemp = temp.replace(subStr, itemContent);
    temp = newTemp;
  }
  
  await fsPromises.mkdir(projectDir, { recursive: true });
  await fsPromises.writeFile(path.join(projectDir, 'index.html'), temp);
}

async function getBundle(dir) {
  const dirMap = await fsPromises.readdir(dir, {withFileTypes: true});
  const filtered = dirMap.filter(i => (i.isFile() && /\.css$/.test(i.name))).map(i => path.join(dir, i.name));
  const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
  let bundleArr = [];
  
  for(let i of filtered) {
    const bundleChunk = await fsPromises.readFile(i, 'utf8');
    bundleArr.push(`${bundleChunk}\n`);
  }
    
  await fsPromises.writeFile(bundlePath, bundleArr);
}

async function copyDir(origin, copy) {
  await fsPromises.rm(copy, { force: true, recursive: true });
  await fsPromises.mkdir(copy, { recursive: true });
  const originMap = await fsPromises.readdir(origin, {withFileTypes: true});
  
  for(let i of originMap) {
    const subOrigin = `${origin}/${i.name}`;
    const subCopy = `${copy}/${i.name}`;
  
    if(i.isDirectory()) {
      await fsPromises.mkdir(subCopy, { recursive: true });
      await copyDir(subOrigin, subCopy);
    } else if(i.isFile()) {
      await fsPromises.copyFile(subOrigin, subCopy);
    }
  }
      
}

projectBundle(__dirname);