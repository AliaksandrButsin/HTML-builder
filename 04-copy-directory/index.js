const fs = require('fs');
const path = require('path');

function copyDir(callback) {
  const sourceDir = path.join(__dirname,'files');
  const targetDir = path.join(__dirname, 'files-copy');
  console.log(sourceDir);

  // удаляем папку files-copy, если она уже существует
  deleteFolderRecursive(targetDir, (err) => {
    if (err && err.code !== 'ENOENT') {
      return callback(err);
    }

    // создаем папку files-copy
    fs.mkdir(targetDir, { recursive: true }, (err) => {
      if (err) {
        return callback(err);
      }
      console.log('Папка создана:', targetDir);

      // копируем файлы
      fs.readdir(sourceDir, (err, files) => {
        if (err) {
          return callback(err);
        }
        copyFiles(files, sourceDir, targetDir, callback);
      });
    });
  });
}

function copyFiles(files, sourceDir, targetDir, callback) {
  let count = files.length;
  if (count === 0) {
    return callback(null);
  }

  for (const file of files) {
    const sourceFilePath = path.join(sourceDir, file);
    const targetFilePath = path.join(targetDir, file);
    fs.copyFile(sourceFilePath, targetFilePath, (err) => {
      if (err) {
        return callback(err);
      }
      count--;
      if (count === 0) {
        callback(null);
      }
    });
  }
}

function deleteFolderRecursive(path, callback) {
  exists(path, (err, exists) => {
    if (err) {
      return callback(err);
    }
    if (!exists) {
      return callback(null);
    }

    fs.readdir(path, (err, files) => {
      if (err) {
        return callback(err);
      }
      let count = files.length;
      if (count === 0) {
        fs.rmdir(path, callback);
      }

      for (const file of files) {
        const curPath = path + "/" + file;
        fs.lstat(curPath, (err, stats) => {
          if (err) {
            return callback(err);
          }
          if (stats.isDirectory()) {
            deleteFolderRecursive(curPath, (err) => {
              if (err) {
                return callback(err);
              }
              count--;
              if (count === 0) {
                fs.rmdir(path, callback);
              }
            });
          } else {
            fs.unlink(curPath, (err) => {
              if (err) {
                return callback(err);
              }
              count--;
              if (count === 0) {
                fs.rmdir(path, callback);
              }
            });
          }
        });
      }
    });
  });
}

function exists(path, callback) {
  fs.access(path, (err) => {
    if (err) {
      callback(null, false);
    } else {
      callback(null, true);
    }
  });
}

copyDir((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Копирование завершено');
  }
});
