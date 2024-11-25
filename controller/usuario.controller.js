// controllers/exampleController.js
const pool = require('../db/conn');
const usuarioModel = require('../model/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

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
                redirectTo: "/homeUsuario/home-paciente",
            });

        } else if (data.mapa == "M") {
            //Sucesso
            return res.status(200).json({
                message: "Autenticado com sucesso!",
                token,
                redirectTo: "/Medico/index",
            });

        } else if (data.mapa == "R") {
            //Sucesso
            return res.status(200).json({
                message: "Autenticado com sucesso!",
                token,
                redirectTo: "/homeRecepcionista/index",
            });
        } else if (data.mapa == "A") {
            //Sucesso
            return res.status(200).json({
                message: "Autenticado com sucesso!",
                token,
                redirectTo: "/home/home-administrador",
            });
        }

        
    } catch (err) {
        res.status(500).send('Erro ao verificar dados - controller');
    }
}

//Inserção de usuário no banco de dados
const criarUsuario = async (req, res) => {
    const { nomeCompleto, cpf, endereco, numero, bairro, cidade, telefone, email, senha, confirmarSenha, data_nasc, tipoUsuario } = req.body;

    // Validações de campos em branco
    if (!nomeCompleto || !cpf || !endereco || !numero || !bairro || !cidade || !telefone || !email || !senha || !confirmarSenha || !tipoUsuario) {
        return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
        return res.status(400).json({ message: "As senhas não coincidem!" });
    }

    // Formata o telefone
    const telefoneFormatado = telefone.replace(/\D/g, "");

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    let mapaT;

    if (tipoUsuario == "medico") {
        mapaT = "M";
    } else if (tipoUsuario == "recepcionista") {
        mapaT = "R";
    } else if (tipoUsuario == "adm") {
        mapaT = "M";
    } else {
        mapaT = "U";
    }

    try {
        const novoUsuario = await usuarioModel.createUsuario({
            nome: nomeCompleto,
            cpf,
            email,
            senha: senhaCriptografada,
            mapa: mapaT,
            contato: telefoneFormatado,
            numero_casa: numero,
            rua: endereco,
            bairro,
            cidade,
            data_nasc
        });

        if (!novoUsuario) {
            return res.status(400).json({ message: "Erro ao cadastrar usuário" });
        }

        res.redirect("/home/home-administrador");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    logarUsuario,
    renderizaFormLogin,
    criarUsuario
};
