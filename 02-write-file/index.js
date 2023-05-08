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
(async function() {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
  } catch {
    await fs.promises.writeFile(filePath, '');
  }
})();

// Функция для записи текста в файл
async function writeToFile(text) {
  await fs.promises.appendFile(filePath, `${text}\n`);
}

// Запрашиваем у пользователя ввод и записываем его в файл
async function askUser() {
  rl.question('("exit" завершить и сохранить.) Введите следующую строку: ', async (answer) => {
    if (answer === 'exit') {
      console.log('\nВаши данные сохранены. \nДо свидания!');
      rl.close();
    } else {
      await writeToFile(answer);
      await askUser();
    }
  });
}

// Обработка сигнала SIGINT
rl.on('SIGINT', async () => {
  console.log('\n\nВаши данные сохранены. \nДо свидания!');
  rl.close();
});

// Запускаем приложение
(async function() {
  try {
    await askUser();
  } catch (error) {
    console.error(error);
    rl.close();
  }
})();
