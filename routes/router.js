var express = require('express');
const usuarioController = require('../controller/usuario.controller');
const router = express.Router();

// Renderizando a página home
router.get('/', function(req, res, next) {
  res.render('landing/index');
});

// Renderizando a página login
router
    .get('/login', function(req, res, next) {
      res.render('landing/login');
    })
    .post('/login', usuarioController.inserirUsuarios);


module.exports = router;
