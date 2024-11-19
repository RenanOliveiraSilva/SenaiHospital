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

//Renderiza Landing
const renderizaMedico = async (req, res) => {
    try {
       res.render('./home/cadastrar_medico')

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}


const renderizaUser = async (req, res) => {
    try {
       res.render('./home/cadastrar_user')

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza Landing
const renderizaHome = async (req, res) => {
    try {
       res.render('./home/index')

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza Home
const renderizaFormLogin = async (req, res) => {
    try {
        res.render('./landing/formLogin')

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Verificar senha do usuário
const logarUsuario = async (req, res) => {
    const { userEmail, userPass } = req.body;

    try {
        // Buscar o usuário pelo email
        const data = await usuarioModel.getUsuarioByEmail(userEmail);

         // Se o usuário não existir, retornar erro
         if (!data) {
             return res.status(404).send('Usuário não encontrado');
         }
 
        // Comparar a senha fornecida com o hash armazenado no banco de dados
        const senhaCorreta = await bcrypt.compare(userPass, data.senha);

        if (!senhaCorreta) {
            return res.status(400).send('Usuário ou Senha incorreta');
        }

         // Login bem-sucedido: Gerar um token JWT
        const token = jwt.sign(
            { id: data.id, email: data.email }, // Dados para incluir no token
            SECRET_KEY, // Chave secreta
            { expiresIn: '1h' } // Duração do token
        );
        
        console.log(data.mapa)

        //Verifiacar qual o tipo de acesso
        if (data.mapa == "U") {
            //Sucesso
            return res.status(200).json({
                message: "Autenticado com sucesso!",
                token,
                redirectTo: "/homeUsuario/index",
            });

        } else if (data.mapa == "M") {
            //Sucesso
            return res.status(200).json({
                message: "Autenticado com sucesso!",
                token,
                redirectTo: "/Medico/index",
            });

        } else if (data.mapa == "A") {
            //Sucesso
            return res.status(200).json({
                message: "Autenticado com sucesso!",
                token,
                redirectTo: "/homeRecepcionista/index",
            });
        }

        
    } catch (err) {
        res.status(500).send('Erro ao verificar dados - controller');
    }
}

// Inserir usuário no banco de dados
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
    logarUsuario,
    inserirUsuarios,
    renderizaFormLogin,
    renderizaHome,
    renderizaLanding,
    renderizaMedico,
    renderizaUser
};
