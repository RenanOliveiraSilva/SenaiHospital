// controllers/exampleController.js
const pool = require('../db/conn');
const pacienteModel = require('../model/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;



module.exports = {
    
};
