const funcionarioModel = require('../model/funcionarios.model');

// Cria um novo funcionário
const postCreateFuncionario = async (req, res) => {
    try {
        const funcionarioData = req.body;

        // Valida os campos obrigatórios
        if (!funcionarioData.nome || !funcionarioData.cpf || !funcionarioData.cargo || !funcionarioData.salario || !funcionarioData.data_admissao || !funcionarioData.id_usuario) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        const novoFuncionario = await funcionarioModel.createFuncionario(funcionarioData);
        res.status(201).json(novoFuncionario);
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
const getFuncionarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const funcionario = await funcionarioModel.getFuncionarioById(id);
        if (!funcionario) {
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
        }
        res.status(200).json(funcionario);
    } catch (error) {
        console.error('Erro ao buscar funcionário pelo ID:', error);
        res.status(500).json({ message: 'Erro ao buscar funcionário.' });
    }
};

// Atualiza um funcionário
const putUpdateFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        const funcionarioData = req.body;

        // Valida os campos obrigatórios
        if (!funcionarioData.nome || !funcionarioData.cpf || !funcionarioData.cargo || !funcionarioData.salario || !funcionarioData.data_admissao) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        const funcionarioAtualizado = await funcionarioModel.updateFuncionario(id, funcionarioData);
        if (!funcionarioAtualizado) {
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
        }

        res.status(200).json(funcionarioAtualizado);
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
        res.status(200).json({ message: 'Funcionário excluído com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        res.status(500).json({ message: 'Erro ao excluir funcionário.' });
    }
};

module.exports = {
    postCreateFuncionario,
    getFuncionarios,
    getFuncionarioById,
    putUpdateFuncionario,
    deleteFuncionario,
};
