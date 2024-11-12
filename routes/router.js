var express = require('express');
const usuarioController = require('../controller/usuario.controller');
const router = express.Router();

// Renderizando a página home
router.get('/', function(req, res, next) {
  res.render('landing/index');
});

// Renderizando a página login
<<<<<<< HEAD
router.get('/login', function(req, res, next) {
  res.render('home/cadastrar_user');
});

router.get('/home', usuarioController.listarUsuarios);

//Cadastrar usuário
router.post('/cad_user', usuarioController.inserirUsuarios);
=======
router
    .get('/login', function(req, res, next) {
      res.render('landing/login');
    })
    .post('/login', usuarioController.inserirUsuarios);

>>>>>>> a79070fd6ccf54303952e38d60c3a7efffcb9e55

//Validação do usuário
router.post('/login', usuarioController.logarUsuario);


module.exports = router;
