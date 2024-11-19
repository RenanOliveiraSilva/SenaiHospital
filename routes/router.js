var express = require('express');

const controller = require('../controller/controller')
const admController = require('../controller/adm.controller')
const usuarioController = require('../controller/usuario.controller');
const recepcionistaController = require('../controller/recepcionista.controller');

const { authMiddleware } = require('../middleWare/authMiddleware');

const router = express.Router();

// Renderizando a página home
router.get('/', controller.renderizaLanding);

//Rota para Login
router
    .get('/login', usuarioController.renderizaFormLogin) //Rendezirando Login
    .post('/login', usuarioController.logarUsuario); //Validação de Usuário

//Rotas do ADM
router
    .get('/home/home-administrador', admController.renderizaHome, authMiddleware)
    .get('/home/cadastro_medico', admController.renderizaCadMedico)
    .get('/home/cadastro_user', admController.renderizaCadUser)
    .get('/home/cadastro_paciente', admController.renderizaCadPaciente)
    .post('/cad_user', usuarioController.inserirUsuarios);

//Rotas do Recepcionista
router.get('/homeRecepcionista/index', recepcionistaController.renderizaIndex, authMiddleware)
      .get('/homeRecepcionista/cadastro_paciente', recepcionistaController.renderizaFormPaciente);

module.exports = router;
