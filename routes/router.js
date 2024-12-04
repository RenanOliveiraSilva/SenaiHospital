var express = require('express');

const controller = require('../controller/controller');
const admController = require('../controller/adm.controller');
const usuarioController = require('../controller/usuario.controller');
const medicoController = require('../controller/medico.controller');
const funcionarioController = require('../controller/funcionario.controller');
const pacienteController = require('../controller/paciente.controller');

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
    .get('/home/gerenciar_medicos', admController.renderizaListaMed)
    .get('/home/gerenciar_funcionarios', admController.renderizaListaFunc)
    .get('/home/gerenciar_pacientes', admController.renderizaListaPacientes)
    .get('/home/cadastro_medico', admController.renderizaCadMedico)
    .get('/home/cadastro_user/:t', admController.renderizaCadUser)
    .get('/home/cadastro_paciente/:t', admController.renderizaCadPaciente)
    .get('/home/cadastro_funcionario', admController.renderizaCadFunc)
    .get('/usuarios/editar/:id', usuarioController.getEditarUsuario)
    .get('/medicos/editar/:id', medicoController.getEditarMedico)
    .get('/funcionarios/editar/:id', funcionarioController.getEditarFuncionario)
    .get('/pacientes/editar/:id', pacienteController.getEditarPaciente)
    .post('/home/cadastro_user/:t', usuarioController.criarUsuario)
    .post('/home/cadastro_medico', medicoController.postMedico)
    .post('/home/cadastro_funcionario', funcionarioController.postCreateFuncionario)
    .post('/home/cadastro_paciente/:t', pacienteController.postPaciente)
    .put('/usuarios/editar/:id', usuarioController.postEditarUsuario)
    .put('/medicos/editar/:id', medicoController.postEditarMedico)
    .put('/funcionarios/editar/:id', funcionarioController.putUpdateFuncionario)
    .put('/pacientes/editar/:id', pacienteController.putPaciente)
    .delete('/usuarios/:id', usuarioController.excluirUsuario)
    .delete('/medicos/:id', medicoController.excluirMedico)
    .delete('/funcionarios/:id', funcionarioController.deleteFuncionario)
    .delete('/pacientes/:id', pacienteController.deletePaciente
);

// //Rotas Médico
router
    .get('/home/home-medico', medicoController.renderizaHomeMedico)
    .get('/home/gerencia-consulta', medicoController.renderizarConsultasMedico)
    .get('/home/consulta-medico', medicoController.getConsultasDoDia)
    .get('/consultas-medico', medicoController.getConsultasDoDia)
    .get('/prontuario', medicoController.renderizarProntuario)
    .post('/prontuario', medicoController.criarProntuario);

// //Rotas Paciente
router
    .get('/home/home-paciente/:id', pacienteController.renderizaHomePaciente)
    .get('/home/agendar-consulta', pacienteController.renderizarAgendamentoConsulta)
    .get('/medicos-disponiveis', pacienteController.getMedicosDisponiveis)
    .get('/dias-disponiveis', pacienteController.getDiasDisponiveis)
    .get('/horarios-disponiveis', pacienteController.getHorariosDisponiveis)
    .post('/agendar-consulta', pacienteController.agendarConsulta);

//Rotas Funcionário
router
    .get('/home/home-funcionario', funcionarioController.renderizaHomeFuncionario)
    .post('/enviar-notificacao', funcionarioController.enviarNotificacao);


    router.get('/teste', (req, res) => {
        res.render('homeMedico/consulta-medico'); // Caminho correto para a tela
    });



module.exports = router;
