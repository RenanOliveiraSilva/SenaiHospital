const pool = require('../db/conn');
const pacienteModel = require('../model/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Renderiza Cadastro_medico
const renderizaCadMedico = async (req, res) => {
    try {
       res.render('./home/cadastrar_medico')

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

module.exports = {
    renderizaCadMedico,
    renderizaCadUser,
    renderizaHome,
    renderizaCadPaciente
};
