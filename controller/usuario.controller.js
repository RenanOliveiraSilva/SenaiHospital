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

//Verificar senha do usuário
const logarUsuario = async (req, res) => {
    const { userEmail, userPass } = req.body;

    try {
         // Buscar o usuário pelo email
         const data = await usuarioModel.getUsuarioByEmail(userEmail);

         console.log(userPass)

         // Se o usuário não existir, retornar erro
         if (!data) {
             return res.status(404).send('Usuário não encontrado');
         }
 
        // Comparar a senha fornecida com o hash armazenado no banco de dados
        const senhaCorreta = await bcrypt.compare(userPass, data.senha);
        console.log(senhaCorreta)

        if (!senhaCorreta) {
            return res.status(400).send('Senha incorreta');
        }
 
         // Se a senha estiver correta, enviar os dados do usuário
         res.status(200).json({ mensagem: 'Login bem-sucedido', usuario: data });
        
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
    listarUsuarios,
    logarUsuario,
    inserirUsuarios
};
