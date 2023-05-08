const fs = require('fs');
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname,'files');
  const targetDir = path.join(__dirname, 'files-copy');
  console.log(sourceDir);

  // удаляем папку files-copy, если она уже существует
  try {
    await deleteFolderRecursive(targetDir);
  } catch (err) {
    // ignore error if folder does not exist
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  // создаем папку files-copy
  try {
    await fs.promises.mkdir(targetDir, { recursive: true });
    console.log('Папка создана:', targetDir);
  } catch (err) {
    throw err;
  }

  // копируем файлы
  try {
    const files = await fs.promises.readdir(sourceDir);
    for (const file of files) {
      const sourceFilePath = path.join(sourceDir, file);
      const targetFilePath = path.join(targetDir, file);
      await fs.promises.copyFile(sourceFilePath, targetFilePath);
    }
  } catch (err) {
    throw err;
  }
}

async function deleteFolderRecursive(path) {
  if (await exists(path)) {
    const files = await fs.promises.readdir(path);
    for (const file of files) {
      const curPath = path + "/" + file;
      if ((await fs.promises.lstat(curPath)).isDirectory()) {
        await deleteFolderRecursive(curPath);
      } else {
        await fs.promises.unlink(curPath);
      }
    }
    await fs.promises.rmdir(path);
  }
}

async function exists(path) {
  try {
    await fs.promises.access(path);
    return true;
  } catch (err) {
    return false;
  }
}

copyDir();
