// controllers/exampleController.js
const pool = require('../db/conn');
const usuarioModel = require('../model/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

//Renderiza home recepcionista
const renderizaIndex = async (req, res) => {
    try {
       res.render('homeRecepcionista/index')

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza home recepcionista
const renderizaFormPaciente = async (req, res) => {
    try {
       res.render('./homeRecepcionista/cadastrar_paciente')
    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}


module.exports = {
    renderizaIndex,
    renderizaFormPaciente
};
