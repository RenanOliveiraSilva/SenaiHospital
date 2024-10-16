const express = require('express');
var path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const mainRouter = require("./routes/router");

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use("/", mainRouter);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} !!!`);
})
