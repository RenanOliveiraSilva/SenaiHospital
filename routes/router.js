var express = require('express');

const controller = require('../controller/controller');
const admController = require('../controller/adm.controller');
const usuarioController = require('../controller/usuario.controller');
const recepcionistaController = require('../controller/recepcionista.controller');
const medicoController = require('../controller/medico.controller');

const router = express.Router();

// Renderizando a página home
router.get('/', controller.renderizaLanding);

//Rota para Login
router
    .get('/login', usuarioController.renderizaFormLogin) //Rendezirando Login
    .post('/login', usuarioController.logarUsuario); //Validação de Usuário

//Rotas do ADM
router
    .get('/home/home-administrador', admController.renderizaHome)
    .get('/home/gerenciar_user', admController.renderizaGerenciarUser)
    .get('/home/cadastro_medico', admController.renderizaCadMedico)
    .get('/home/cadastro_user', admController.renderizaCadUser)
    .get('/home/cadastro_paciente', admController.renderizaCadPaciente)
    .get('/usuarios/editar/:id', usuarioController.getEditarUsuario)
    .get('/medicos/editar/:id', medicoController.getEditarMedico)
    .get('/home/gerenciar_medicos', admController.renderizaListaMed)
    .post('/home/cadastro_user', usuarioController.criarUsuario)
    .post('/home/cadastro_medico', medicoController.postMedico)
    .put('/usuarios/editar/:id', usuarioController.postEditarUsuario)
    .put('/medicos/editar/:id', medicoController.postEditarMedico)
    .delete('/usuarios/:id', usuarioController.excluirUsuario)
    .delete('/medicos/:id', medicoController.excluirMedico
);

//Rotas do Recepcionista
router.get('/homeRecepcionista/index', recepcionistaController.renderizaIndex)
      .get('/homeRecepcionista/cadastro_paciente', recepcionistaController.renderizaFormPaciente);

module.exports = router;
