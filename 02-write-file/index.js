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
fs.access(filePath, fs.constants.F_OK, (err) => {
  if (err) {
    fs.writeFile(filePath, '', (err) => {
      if (err) {
        console.error(err);
        rl.close();
      }
    });
  }
});

// Функция для записи текста в файл
function writeToFile(text, callback) {
  fs.appendFile(filePath, `${text}\n`, callback);
}

// Запрашиваем у пользователя ввод и записываем его в файл
function askUser() {
  rl.question('("exit" завершить и сохранить.) Введите следующую строку: ', (answer) => {
    if ( answer.toString().toLowerCase().trim() === 'exit') {
      console.log('\nВаши данные сохранены. \nДо свидания!');
      rl.close();
    } else {
      writeToFile(answer, (err) => {
        if (err) {
          console.error(err);
          rl.close();
        } else {
          askUser();
        }
      });
    }
  });
}

// Обработка сигнала SIGINT
rl.on('SIGINT', () => {
  console.log('\n\nВаши данные сохранены. \nДо свидания!');
  rl.close();
});

// Запускаем приложение
try {
  askUser();
} catch (error) {
  console.error(error);
  rl.close();
}
