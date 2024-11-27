const pool = require('../db/conn');
const pacienteModel = require('../model/usuario.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const medicoModel = require('../model/medicos.model');

// Inserção de médico no banco de dados
const postMedico = async (req, res) => {
    const { funcionario, crm, especialidade, subespecialidade, universidade_graduacao, ano_conclusao, disponibilidade } = req.body;

    // Validações de campos em branco
    if (!funcionario || !crm || !especialidade || !universidade_graduacao || !ano_conclusao || !disponibilidade) {
        return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    try {
        // Verifica se o CRM já está cadastrado
        const medicoExistenteCrm = await medicoModel.getMedicoByCrm(crm);
        if (medicoExistenteCrm) {
            return res.status(409).json({ message: "CRM já cadastrado!" });
        }

        // Cria o médico
        const novoMedico = await medicoModel.createMedico({
            funcionario,
            crm,
            especialidade,
            subespecialidade,
            universidade_graduacao,
            ano_conclusao,
            disponibilidade
        });

        if (!novoMedico) {
            return res.status(400).json({ message: "Erro ao cadastrar médico" });
        }

        // Redireciona após o cadastro
        res.redirect("/home/home-administrador");
    } catch (error) {
        console.error('Erro ao criar médico:', error);
        res.status(500).json({ error: error.message });
    }
};

// Exclusão de médico no banco de dados
const excluirMedico = async (req, res) => {
    try {
        const medicoId = req.params.id;

        // Chama o modelo para excluir o usuário
        const medicoExcluido = await medicoModel.deleteMedico(medicoId);

        if (!medicoExcluido) {
            return res.status(404).json({ message: 'Médico não encontrado!' });
        }

        // Redireciona para a listagem de usuários após a exclusão
        res.redirect('/home/home-administrador');
    } catch (error) {
        console.error('Erro ao excluir médico:', error);
        res.status(500).json({ error: 'Erro ao excluir médico' });
    }
};


module.exports = {
    postMedico,
    excluirMedico
};
