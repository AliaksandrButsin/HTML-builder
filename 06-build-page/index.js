const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Создаем директорию project-dist
const projectDistPath = path.join(__dirname, 'project-dist');
if (!fs.existsSync(projectDistPath)) {
  fs.mkdirSync(projectDistPath);
}

// Собираем содержимое компонентов в index.html
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const headerPath = path.join(componentsPath, 'header.html');
const articlesPath = path.join(componentsPath, 'articles.html');
const footerPath = path.join(componentsPath, 'footer.html');
const indexPath = path.join(projectDistPath, 'index.html');

let indexHtml = fs.readFileSync(templatePath, 'utf8');
indexHtml = indexHtml.replace('{{header}}', fs.readFileSync(headerPath, 'utf8'));
indexHtml = indexHtml.replace('{{articles}}', fs.readFileSync(articlesPath, 'utf8'));
indexHtml = indexHtml.replace('{{footer}}', fs.readFileSync(footerPath, 'utf8'));
fs.writeFileSync(indexPath, indexHtml);

// Собираем стили в style.css
const stylesPath = path.join(__dirname, 'styles');
const styleFilePath = path.join(projectDistPath, 'style.css');

const files = fs.readdirSync(stylesPath);
let styles = '';
files.forEach((file) => {
  const filePath = path.join(stylesPath, file);
  const stat = fs.statSync(filePath);
  if (stat.isFile()) {
    styles += fs.readFileSync(filePath, 'utf8');
  }
});
fs.writeFileSync(styleFilePath, styles);

// Копируем папку assets
const assetsPath = path.join(__dirname, 'assets');
const assetsDistPath = path.join(projectDistPath, 'assets');

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);
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

copyDir(assetsPath, assetsDistPath)
  .then(() => console.log('Build successful!'))
  .catch((err) => console.error(err));
