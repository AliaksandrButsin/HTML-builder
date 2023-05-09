const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');

fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const cssFiles = files.filter(file => path.extname(file) === '.css');
  const outputFilePath = path.join(distDir, 'bundle.css');

  let i = 0;
  const writeNextFile = () => {
    if (i < cssFiles.length) {
      const file = cssFiles[i++];
      const sourceFilePath = path.join(stylesDir, file);
      fs.readFile(sourceFilePath, 'utf8', (err, css) => {
        if (err) {
          console.error(err);
          return;
        }
        fs.appendFile(outputFilePath, css, err => {
          if (err) {
            console.error(err);
            return;
          }
          writeNextFile();
        });
      });
    } else {
      console.log(`Собрано ${cssFiles.length} CSS файлов в ${outputFilePath}`);
    }
  };

  fs.unlink(outputFilePath, err => {
    if (err && err.code !== 'ENOENT') {
      console.error(err);
      return;
    }
    writeNextFile();
  });
});
