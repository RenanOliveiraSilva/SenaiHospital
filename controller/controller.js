// controllers/exampleController.js
const pool = require('../db/conn');
const usuarioModel = require('../model/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

//Renderiza Landing
const renderizaLanding = async (req, res) => {
    try {
       res.render('./landing/index')

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}



module.exports = {
    renderizaLanding
};