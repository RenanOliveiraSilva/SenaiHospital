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


// Função para verificar horários disponíveis para um médico específico em uma data específica
const getHorariosDisponiveis = async (data, medicoId) => {
    try {
        const horariosDisponiveis = ['8', '10', '14', '16'];

        const result = await pool.query(`
            SELECT horario
            FROM consultas
            WHERE data = $1 AND medico_id = $2
        `, [data, medicoId]);

        const horariosOcupados = result.rows.map(row => row.horario);

        return horariosDisponiveis.filter(horario => !horariosOcupados.includes(horario));
    } catch (err) {
        console.error('Erro ao buscar horários disponíveis:', err);
        throw err;
    }
};

// Função para obter médicos disponíveis em determinada data e local
const getMedicosDisponiveis = async (data, localId) => {
    try {
        const result = await pool.query(`
            SELECT m.id, u.nome 
            FROM medico m
            JOIN funcionario f ON m.id_funcionario = f.id
            JOIN usuario u ON f.id_usuario = u.id
            WHERE m.local_consulta = $1
            AND m.disponibilidade @> $2::date
        `, [localId, data]);

        return result.rows;
    } catch (err) {
        console.error('Erro ao buscar médicos disponíveis:', err);
        throw err;
    }
};

// Função para agendar uma consulta
const agendarConsulta = async (consultaData) => {
    const { data, horario, medicoId, localConsulta, pacienteId } = consultaData;

    try {
        const result = await pool.query(`
            INSERT INTO consulta (data, horario, id_medico, local_consulta, id_paciente)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [data, horario, medicoId, localConsulta, pacienteId]);

        return result.rows[0];
    } catch (err) {
        console.error('Erro ao agendar consulta:', err);
        throw err;
    }
};

module.exports = {
    addPaciente,
    getAllPacientes,
    getPacienteById,
    updatePaciente,
    deletePaciente,
    agendarConsulta,
    getMedicosDisponiveis,
    getHorariosDisponiveis
    
};