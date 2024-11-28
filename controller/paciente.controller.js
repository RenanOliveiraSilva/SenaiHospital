const PacienteModel = require('../model/paciente.model');

// Adicionar Paciente
const postAddPaciente = async (req, res) => {
    try {
        const novoPaciente = await PacienteModel.addPaciente(req.body);
        res.status(201).json(novoPaciente);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao adicionar paciente' });
    }
};

// Obter Todos os Pacientes
const getPacientes = async (req, res) => {
    try {
        const pacientes = await PacienteModel.getAllPacientes();
        res.status(200).json(pacientes);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar pacientes' });
    }
};

// Obter Paciente por ID
const getPaciente = async (req, res) => {
    try {
        const paciente = await PacienteModel.getPacienteById(req.params.id);
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente não encontrado' });
        }
        res.status(200).json(paciente);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar paciente' });
    }
};

// Atualizar Paciente
const putUpdatePaciente = async (req, res) => {
    try {
        const pacienteAtualizado = await PacienteModel.updatePaciente(req.params.id, req.body);
        if (!pacienteAtualizado) {
            return res.status(404).json({ error: 'Paciente não encontrado' });
        }
        res.status(200).json(pacienteAtualizado);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar paciente' });
    }
};

// Deletar Paciente
const deletePaciente = async (req, res) => {
    try {
        await PacienteModel.deletePaciente(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar paciente' });
    }
};

module.exports = {
    postAddPaciente,
    getPacientes,
    getPaciente,
    putUpdatePaciente,
    deletePaciente
};
