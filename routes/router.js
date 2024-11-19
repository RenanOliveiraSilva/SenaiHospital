var express = require('express');
const usuarioController = require('../controller/usuario.controller');
const recepcionistaController = require('../controller/recepcionista.controller');

const { authMiddleware } = require('../middleWare/authMiddleware');

const router = express.Router();

// Renderizando a página home
router.get('/', usuarioController.renderizaLanding);

//Rota para Login
router
    .get('/login', usuarioController.renderizaFormLogin) //Rendezirando Login
    .post('/login', usuarioController.logarUsuario); //Validação de Usuário

//Validação do usuário
router
    .get('/home/index', usuarioController.renderizaHome, )
    .get('/home/cadastro_medico', usuarioController.renderizaMedico)
    .get('/home/cadastro_user', usuarioController.renderizaUser)
    .post('/cad_user', usuarioController.inserirUsuarios);


//Rotas do Recepcionista
router.get('/homeRecepcionista/index', recepcionistaController.renderizaIndex, authMiddleware)
      .get('/homeRecepcionista/cadastro_paciente', recepcionistaController.renderizaFormPaciente);


module.exports = router;
