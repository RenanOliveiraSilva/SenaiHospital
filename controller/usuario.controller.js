// controllers/exampleController.js
const pool = require('../db/conn');
const usuarioModel = require('../model/usuario.model');
const bcrypt = require('bcrypt');

// Função para listar os dados
const listarUsuarios = async (req, res) => {
    try {
        const data = await usuarioModel.getTodosUsuarios();
        res.render('home/index', { data });
    } catch (err) {
        res.status(500).send('Erro ao buscar dados');
    }
};

const inserirUsuarios = async (req, res) => {
    const { 
        nome, 
        cpf, 
        email, 
        senha, 
        mapa, 
        contato, 
        numero_casa, 
        rua, 
        bairro, 
        cidade
    } = req.body;

    try {
        // Hash da senha
        const hashedPass = await bcrypt.hash(senha, 10);

        // Inserir no banco de dados chamando o model
        const usuario = await usuarioModel.postUsuario({
            nome, 
            cpf, 
            email, 
            senha: hashedPass,
            mapa, 
            contato, 
            numero_casa, 
            rua, 
            bairro, 
            cidade
        });

        // Responder ao cliente com o usuário inserido
        res.status(201).json(usuario);

    } catch (err) {
        console.error('Erro ao inserir dados:', err);
        res.status(500).send('Erro ao inserir dados');
    }
};

module.exports = {
    listarUsuarios,
    inserirUsuarios
};
