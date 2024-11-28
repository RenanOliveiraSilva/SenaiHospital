const funcionarioModel = require('../model/funcionarios.model');

// Cria um novo funcionário
const postCreateFuncionario = async (req, res) => {
    try {
        const { id_usuario, salario, data_admissao, cargo } = req.body;

        // Valida os campos obrigatórios
        if (!cargo || !salario || !data_admissao || !id_usuario) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        const novoFuncionario = await funcionarioModel.createFuncionario(
            { id_usuario, salario, data_admissao, cargo }
        );

        // Redireciona após o cadastro
        res.redirect("/home/home-administrador");

    } catch (error) {
        console.error('Erro ao criar funcionário:', error);
        res.status(500).json({ message: 'Erro ao criar funcionário.' });
    }
};

// Obtém todos os funcionários
const getFuncionarios = async (req, res) => {
    try {
        const funcionarios = await funcionarioModel.getAllFuncionarios();
        res.status(200).json(funcionarios);
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        res.status(500).json({ message: 'Erro ao buscar funcionários.' });
    }
};

// Obtém um funcionário pelo ID
const getFuncionarioByIdUser = async (req, res) => {
    try {
        const { id } = req.params;
        const funcionario = await funcionarioModel.getFuncionarioByIdUser(id);
        if (!funcionario) {
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
        res.status(200).json(funcionario);
    } catch (error) {
        console.error('Erro ao buscar funcionário pelo ID:', error);
        res.status(500).json({ message: 'Erro ao buscar funcionário.' });
    }
};

// Controller para renderizar o formulário de edição de funcionário
const getEditarFuncionario = async (req, res) => {
    try {
        // Obtém o ID do funcionário a partir dos parâmetros da URL
        const funcionarioId = req.params.id;

        // Busca o funcionário pelo ID no banco de dados
        const funcionario = await funcionarioModel.getFuncionarioById(funcionarioId);

        // Verifica se o funcionário foi encontrado
        if (!funcionario) {
            return res.status(404).send("Funcionário não encontrado");
        }

        // Renderiza o formulário de edição, passando os dados do funcionário para o EJS
        res.render('home/editar_funcionario', { funcionario });

    } catch (err) {
        console.error('Erro ao buscar funcionário para edição:', err);
        res.status(500).send('Erro ao buscar dados do funcionário para edição');
    }
};

// Atualiza um funcionário
const putUpdateFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        const { salario, data_admissao, cargo } = req.body;

        // Valida os campos obrigatórios
        if (!salario || !data_admissao || !cargo) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        const funcionarioAtualizado = await funcionarioModel.updateFuncionario(id, {
            salario,
            data_admissao,
            cargo
        });
        
        if (!funcionarioAtualizado) {
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
        }

        // Redireciona de volta para a listagem de usuários após a edição
        res.redirect('/home/home-administrador');

    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        res.status(500).json({ message: 'Erro ao atualizar funcionário.' });
    }
};

// Exclui um funcionário
const deleteFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        const funcionarioDeletado = await funcionarioModel.deleteFuncionario(id);
        if (!funcionarioDeletado) {
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
        }

       // Redireciona após o cadastro
       res.redirect("/home/home-administrador");
    } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        res.status(500).json({ message: 'Erro ao excluir funcionário.' });
    }
};

module.exports = {
    postCreateFuncionario,
    getFuncionarios,
    getFuncionarioByIdUser,
    getEditarFuncionario,
    putUpdateFuncionario,
    deleteFuncionario,
};
