

const fs = require('fs');
const path = require('path');
const readline = require('readline');


const filePath = path.join(__dirname, 'text.txt');

const { stdout } = process;
stdout.write('Прошу Вас ввести текст который вы хотете добавить в файл text.txt \n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Проверяем, существует ли файл. Если нет, то создаем его.
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '');
}

// Функция для записи текста в файл
function writeToFile(text) {
  fs.appendFileSync(filePath, `${text}\n`);
}

// Запрашиваем у пользователя ввод и записываем его в файл
function askUser() {
  rl.question('("exit" завершить и сохранить.) Введите следующую строку: ', (answer) => {
    if (answer === 'exit') {
      console.log('\nВаши данные сохранены. \nДо свидания!');
      rl.close();
    } else {
      writeToFile(answer);
      askUser();
    }
  });
}
// Запрашиваем у пользователя ввод и записываем его в файл
rl.on('SIGINT', () => {
  console.log('\n\nВаши данные сохранены. \nДо свидания!');
  rl.close();
});

// Запускаем приложение
askUser();