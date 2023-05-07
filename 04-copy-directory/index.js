const fs = require('fs');
const path = require('path');

function copyDir() {
  const sourceDir = path.join(__dirname,'files');
  const targetDir = path.join(__dirname, 'files-copy');
  console.log(sourceDir);

  // удаляем папку files-copy, если она уже существует
  if (fs.existsSync(targetDir)) {
    deleteFolderRecursive(targetDir);
  }

  // создаем папку files-copy
  fs.mkdir(targetDir, { recursive: true }, (err) => {
    if (err) throw err;
    console.log('Папка создана:', targetDir);
  });

  // копируем файлы
  const files = fs.readdirSync(sourceDir);
  files.forEach(file => {
    const sourceFilePath = path.join(sourceDir, file);
    const targetFilePath = path.join(targetDir, file);
    fs.copyFileSync(sourceFilePath, targetFilePath);
  });
}

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(file => {
      const curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}


copyDir()