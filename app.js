// Importando constantes das Bibliotecas
const express = require('express');
var path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Importando rotas
const mainRouter = require("./routes/router");

// Configurando o arquivo app
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Rotas
app.use("/", mainRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

// Rodando o servidor na porta 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} !!!`);
})
