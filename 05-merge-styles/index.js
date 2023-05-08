const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');

// Собираем имена всех файлов в директории styles, оканчивающихся на .css
fs.readdir(stylesDir)
  .then(files => files.filter(file => path.extname(file) === '.css'))
  .then(cssFiles => {
    // Считываем содержимое каждого файла и записываем в выходной файл
    const outputFilePath = path.join(distDir, 'bundle.css');
    cssFiles.reduce((promise, file) => {
      return promise.then(() => {
        return fs.readFile(path.join(stylesDir, file), 'utf8')
          .then(css => fs.appendFile(outputFilePath, css));
      });
    }, Promise.resolve())
    .then(() => console.log(`Собрано ${cssFiles.length} CSS файлов в ${outputFilePath}`));
  })
  .catch(err => console.error(err));
