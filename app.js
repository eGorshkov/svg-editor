// подключение express
const express = require("express");
// создаем объект приложения
const app = express();

app.use(express.static("src"));
// определяем обработчик для маршрута "/"
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/src/index.html");
});
// начинаем прослушивать подключения на 3000 порту
app.listen(3000);
