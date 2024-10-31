var express = require('express');
const usuarioController = require('../controller/usuario.controller');
const router = express.Router();

// Renderizando a página home
router.get('/', function(req, res, next) {
  res.render('landing/index');
});

// Renderizando a página login
router.get('/login', function(req, res, next) {
  res.render('landing/login');
});

router.get('/home', usuarioController.listarUsuarios);

// Renderizando de cadastro de usuário
router.post('/login', usuarioController.logarUsuario);

module.exports = router;
