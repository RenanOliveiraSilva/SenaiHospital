const pool = require('../db/conn');

// Adicionar Paciente
const addPaciente = async (pacienteData) => {
    const { nome, cpf, data_nascimento, contato, endereco } = pacienteData;

    try {
        const result = await pool.query(`
            INSERT INTO pacientes (nome, cpf, data_nascimento, contato, endereco)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [nome, cpf, data_nascimento, contato, endereco]);

        return result.rows[0];
    } catch (err) {
        console.error('Erro ao adicionar paciente:', err);
        throw err;
    }
};

// Obter todos os pacientes
const getAllPacientes = async () => {
    try {
        const result = await pool.query('SELECT * FROM pacientes');
        return result.rows;
    } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
        throw err;
    }
};

// Obter paciente por ID
const getPacienteById = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);
        return result.rows[0];
    } catch (err) {
        console.error('Erro ao buscar paciente pelo ID:', err);
        throw err;
    }
};

// Atualizar Paciente
const updatePaciente = async (id, pacienteData) => {
    const { nome, cpf, data_nascimento, contato, endereco } = pacienteData;

    try {
        const result = await pool.query(`
            UPDATE pacientes
            SET nome = $1, cpf = $2, data_nascimento = $3, contato = $4, endereco = $5
            WHERE id = $6
            RETURNING *;
        `, [nome, cpf, data_nascimento, contato, endereco, id]);

        return result.rows[0];
    } catch (err) {
        console.error('Erro ao atualizar paciente:', err);
        throw err;
    }
};

// Remover Paciente
const deletePaciente = async (id) => {
    try {
        await pool.query('DELETE FROM pacientes WHERE id = $1', [id]);
    } catch (err) {
        console.error('Erro ao deletar paciente:', err);
        throw err;
    }
};

module.exports = {
    addPaciente,
    getAllPacientes,
    getPacienteById,
    updatePaciente,
    deletePaciente
};