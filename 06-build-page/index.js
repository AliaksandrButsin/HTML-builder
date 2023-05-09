const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Создаем директорию project-dist
const projectDistPath = path.join(__dirname, 'project-dist');
(async () => {
  if (!await exists(projectDistPath)) {
    await mkdir(projectDistPath);
  }

 // Собираем содержимое компонентов в index.html
const tagsInHtml = ['{{header}}', '{{about}}', '{{articles}}', '{{footer}}'];
const templatePath = path.join(__dirname, 'template.html');
const templateContent = await fs.promises.readFile(templatePath, 'utf8');

// Поиск всех совпадений шаблонных тегов в строке
const foundTags = templateContent.match(/\{\{[a-z]+\}\}/gi) || [];

// Проверка, что количество найденных тегов равно ожидаемому количеству
if (foundTags.length !== tagsInHtml.length) {
  // Вывод сообщения об отсутствии тегов
  const missingTags = tagsInHtml.filter(tag => !foundTags.includes(tag));
  missingTags.forEach(tag => console.log(`Нет тега ${tag}`));

  const componentsPath = path.join(__dirname, 'components');
  const headerPath = path.join(componentsPath, 'header.html');
  const aboutPath = path.join(componentsPath, 'about.html');
  const articlesPath = path.join(componentsPath, 'articles.html');
  const footerPath = path.join(componentsPath, 'footer.html');
  const indexPath = path.join(projectDistPath, 'index.html');

  let indexHtml = await fs.promises.readFile(templatePath, 'utf8');
  indexHtml = indexHtml.replace('{{header}}', await fs.promises.readFile(headerPath, 'utf8'));
  indexHtml = indexHtml.replace('{{about}}', templateContent.includes('{{about}}') ? await fs.promises.readFile(aboutPath, 'utf8') : '');
  indexHtml = indexHtml.replace('{{articles}}', await fs.promises.readFile(articlesPath, 'utf8'));
  indexHtml = indexHtml.replace('{{footer}}', await fs.promises.readFile(footerPath, 'utf8')); 
  await fs.promises.writeFile(indexPath, indexHtml);

} else { 
  const componentsPath = path.join(__dirname, 'components');
  const headerPath = path.join(componentsPath, 'header.html');
  const aboutPath = path.join(componentsPath, 'about.html');
  const articlesPath = path.join(componentsPath, 'articles.html');
  const footerPath = path.join(componentsPath, 'footer.html');
  const indexPath = path.join(projectDistPath, 'index.html');

  let indexHtml = await fs.promises.readFile(templatePath, 'utf8');
  indexHtml = indexHtml.replace('{{header}}', await fs.promises.readFile(headerPath, 'utf8'));
  indexHtml = indexHtml.replace('{{about}}', templateContent.includes('{{about}}') ? await fs.promises.readFile(aboutPath, 'utf8') : '');
  indexHtml = indexHtml.replace('{{articles}}', await fs.promises.readFile(articlesPath, 'utf8'));
  indexHtml = indexHtml.replace('{{footer}}', await fs.promises.readFile(footerPath, 'utf8')); 
  await fs.promises.writeFile(indexPath, indexHtml);
};

  // Собираем стили в style.css
  const stylesPath = path.join(__dirname, 'styles');
  const styleFilePath = path.join(projectDistPath, 'style.css');

  const files = await readdir(stylesPath);
  let styles = '';
  for (let file of files) {
    const filePath = path.join(stylesPath, file);
    const fileStat = await stat(filePath);
    if (fileStat.isFile()) {
      styles += await fs.promises.readFile(filePath, 'utf8');
    }
  }
  await fs.promises.writeFile(styleFilePath, styles);

  // Копируем папку assets
  const assetsPath = path.join(__dirname, 'assets');
  const assetsDistPath = path.join(projectDistPath, 'assets');

  const copyFile = promisify(fs.copyFile);
  const copyDir = async (src, dest) => {
    await mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await copyFile(srcPath, destPath);
      }
    }
  };

  await copyDir(assetsPath, assetsDistPath);
  console.log('Все задачи выполнены успешно!');
})();

