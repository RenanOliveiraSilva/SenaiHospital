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

//Cadastrar usuário
router.post('/cad_user', usuarioController.inserirUsuarios);

//Validação do usuário
router.post('/login', usuarioController.logarUsuario);

module.exports = router;
