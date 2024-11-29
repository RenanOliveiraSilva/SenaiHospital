const pool = require('../db/conn');

// Função para adicionar um paciente ao banco de dados
const addPaciente = async (pacienteData) => {
    const {
        id_usuario,
        nome,
        idade,
        cpf,
        data_nasc,
        genero,
        relacao_paciente,
        medicamentos_paciente,
        alergias,
        doencas_existentes,
    } = pacienteData;

    try {
        const result = await pool.query(`
            INSERT INTO PACIENTES (
                id_usuario, nome, idade, cpf, data_nasc, genero, relacao_paciente, medicamentos_paciente, alergias, doencas_existentes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `, [
            id_usuario,
            nome,
            idade,
            cpf,
            data_nasc,
            genero,
            relacao_paciente,
            medicamentos_paciente,
            alergias,
            doencas_existentes,
        ]);

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

// Função para obter um paciente pelo ID do usuário
const getPacienteById = async (id) => {
    try {
        const result = await pool.query(`
            SELECT p.*, u.nome AS usuario_nome 
            FROM PACIENTES p
            INNER JOIN USUARIOS u ON p.id_usuario = u.id
            WHERE p.id = $1;
        `, [id]);

        return result.rows[0];
    } catch (err) {
        console.error('Erro ao buscar paciente pelo ID:', err);
        throw err;
    }
};

// Função para atualizar um paciente no banco de dados
const updatePaciente = async (id, pacienteData) => {
    const {
        id_usuario,
        nome,
        idade,
        cpf,
        data_nasc,
        genero,
        relacao_paciente,
        medicamentos_paciente,
        alergias,
        doencas_existentes,
    } = pacienteData;

    try {
        const result = await pool.query(`
            UPDATE PACIENTES SET
                id_usuario = $1,
                nome = $2,
                idade = $3,
                cpf = $4,
                data_nasc = $5,
                genero = $6,
                relacao_paciente = $7,
                medicamentos_paciente = $8,
                alergias = $9,
                doencas_existentes = $10
            WHERE id = $11
            RETURNING *;
        `, [
            id_usuario,
            nome,
            idade,
            cpf,
            data_nasc,
            genero,
            relacao_paciente,
            medicamentos_paciente,
            alergias,
            doencas_existentes,
            id,
        ]);

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

const getPacienteByCpf = async (cpf) => {
    try {
        const result = await pool.query('SELECT * FROM pacientes WHERE cpf = $1', [cpf]);
        return result.rows[0];
    } catch (err) {
        console.error('Erro ao buscar paciente pelo CPF:', err);
        throw err;
    }
}

module.exports = {
    addPaciente,
    getAllPacientes,
    getPacienteById,
    updatePaciente,
    deletePaciente,
    getPacienteByCpf
};