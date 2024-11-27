const pool = require('../db/conn');
const userModel = require('../model/usuario.model');
const medicoModel = require('../model/medicos.model');
const admModel = require('../model/adm.model');


//Renderiza Cadastro_medico
const renderizaCadMedico = async (req, res) => {
    try {
        const funcionarios = await admModel.getFuncinariosMedicos();

       res.render('./home/cadastrar_medico', { funcionarios })

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza Cadastro_User
const renderizaCadUser = async (req, res) => {
    try {
       res.render('./home/cadastrar_user')

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza home administrador
const renderizaHome = async (req, res) => {
    try {
       res.render('./home/home-administrador')

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza home administrador
const renderizaCadPaciente = async (req, res) => {
    try {
       res.render('./home/cadastrar_paciente')

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza home administrador
const renderizaGerenciarUser = async (req, res) => {
    try {
    const usuarios = await userModel.getTodosUsuarios();
       res.render('./home/gerenciar_usuario', { usuarios })

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza home administrador
const renderizaListaMed = async (req, res) => {
    try {
        const medicos = await medicoModel.getTodosMedicos();
        res.render('./home/gerenciar_medicos', { medicos })

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}


module.exports = {
    renderizaCadMedico,
    renderizaCadUser,
    renderizaHome,
    renderizaCadPaciente,
    renderizaGerenciarUser,
    renderizaListaMed
};
