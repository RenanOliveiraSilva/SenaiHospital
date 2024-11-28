const usuarioModel = require('../model/usuario.model');
const bcrypt = require('bcrypt');

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

        //Verifiacar qual o tipo de acesso
        if (data.mapa == "U") {
            //Sucesso
            return res.status(200).json({
                message: "Autenticado com sucesso!",
                redirectTo: "/homeUsuario/home-paciente",
            });

        } else if (data.mapa == "M") {
            //Sucesso
            return res.status(200).json({
                message: "Autenticado com sucesso!",
                redirectTo: "/Medico/index",
            });

        } else if (data.mapa == "R") {
            //Sucesso
            return res.status(200).json({
                message: "Autenticado com sucesso!",
                redirectTo: "/homeRecepcionista/index",
            });
        } else if (data.mapa == "A") {
            //Sucesso
            return res.status(200).json({
                message: "Autenticado com sucesso!",
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
    
    try {
        // Verifica se as senhas coincidem
        if (senha !== confirmarSenha) {
            return res.status(400).json({ message: "As senhas não coincidem!" });
        }

        // Verifica se o CPF já está cadastrado
        const usuarioExistenteCpf = await usuarioModel.getUsuarioByCpf(cpf);
        if (usuarioExistenteCpf) {
            return res.status(409).json({ message: "CPF já cadastrado!" });
        }

        // Verifica se o e-mail já está cadastrado
        const usuarioExistenteEmail = await usuarioModel.getUsuarioByEmail(email);
        if (usuarioExistenteEmail) {
            return res.status(409).json({ message: "E-mail já cadastrado!" });
        }

        // Criptografa a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Define o tipo de usuário no campo "mapa"
        let mapaT;
        switch (tipoUsuario) {
            case "medico":
                mapaT = "M";
                break;
            case "recepcionista":
                mapaT = "R";
                break;
            case "adm":
                mapaT = "A";
                break;
            default:
                mapaT = "U";
        }

        // Cria o usuário
        const novoUsuario = await usuarioModel.createUsuario({
            nome: nomeCompleto,
            cpf,
            email,
            senha: senhaCriptografada,
            mapa: mapaT,
            contato: telefone,
            numero_casa: numero,
            rua: endereco,
            bairro,
            cidade,
            data_nasc
        });

        if (!novoUsuario) {
            return res.status(400).json({ message: "Erro ao cadastrar usuário" });
        }

        // Redireciona após o cadastro
        res.redirect("/home/home-administrador");
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: error.message });
    }
};

// Função para renderizar a página de edição do usuário
const getEditarUsuario = async (req, res) => {
    
    try {
        const usuarioId = req.params.id;
        const usuario = await usuarioModel.getUsuarioById(usuarioId);
        

        if (!usuario) {
            return res.status(404).send('Usuário não encontrado');
        }

        // Renderiza a view de edição do usuário com os dados do usuário atual
        res.render('home/editar_usuario', { usuario });

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).send('Erro ao buscar usuário');
    }
};

// Função para atualizar os dados do usuário
const postEditarUsuario = async (req, res) => {
    
    try {
        const usuarioId = req.params.id;

        const {
            nomeCompleto,
            email,
            senha,
            telefone,
            numero,
            endereco,
            bairro,
            cidade,
            data_nasc,
            tipoUsuario,
            confirmarSenha
        } = req.body;

        // Verifica se as senhas coincidem
        if (senha !== confirmarSenha) {
            return res.status(400).json({ message: "As senhas não coincidem!" });
        }

        const usuario = await usuarioModel.getUsuarioById(usuarioId);
        let senhaCriptografada;

        if (senha) {
            senhaCriptografada = await bcrypt.hash(senha, 10);
            
        }  else {
            senhaCriptografada = usuario.senha;

        }

        if(usuario.email != email){
            // Verifica se o e-mail já está cadastrado
            const usuarioExistenteEmail = await usuarioModel.getUsuarioByEmail(email);
            if (usuarioExistenteEmail) {
                return res.status(409).json({ message: "E-mail já cadastrado!" });
            }
        }

        let mapaT;

        if (tipoUsuario == "medico") {
            mapaT = "M";
        } else if (tipoUsuario == "recepcionista") {
            mapaT = "R";
        } else if (tipoUsuario == "adm") {
            mapaT = "A";
        } else {
            mapaT = "U";
    }

        const usuarioAtualizado = await usuarioModel.updateUsuario(usuarioId, {
            nome: nomeCompleto,
            senha: senhaCriptografada,
            email,
            mapa: mapaT,
            contato: telefone,
            numero_casa: numero,
            rua: endereco,
            bairro,
            cidade,
            data_nasc,
        });

        if (!usuarioAtualizado) {
            return res.status(404).send('Usuário não encontrado');
        }

        // Redireciona de volta para a listagem de usuários após a edição
        res.redirect('/home/home-administrador');
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).send('Erro ao atualizar usuário');
    }
};

// Exclusão de usuário no banco de dados
const excluirUsuario = async (req, res) => {
    try {
        const usuarioId = req.params.id;

        // Chama o modelo para excluir o usuário
        const usuarioExcluido = await usuarioModel.deleteUsuario(usuarioId);

        console.log(usuarioExcluido)

        if (!usuarioExcluido) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        // Redireciona para a listagem de usuários após a exclusão
        res.redirect('/home/home-administrador');
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
};

module.exports = {
    logarUsuario,
    renderizaFormLogin,
    criarUsuario,
    getEditarUsuario,
    postEditarUsuario,
    excluirUsuario
};
