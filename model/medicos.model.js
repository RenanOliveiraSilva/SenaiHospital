const pool = require('../db/conn');

// Model para buscar todos os médicos e seus nomes da tabela de usuários
const getTodosMedicos = async () => {
    try {
        const query = `
            SELECT 
                m.id AS medico_id,
                m.crm,
                m.especialidade,
                m.subespecialidade,
                m.universidade_grad,
                m.ano_conclusao,
                m.disponibilidade,
                u.mapa AS usuario_mapa,
                u.nome AS usuario_nome,
                u.email AS usuario_email,
                u.cpf AS usuario_cpf,
                u.contato AS usuario_contato
            FROM 
                MEDICOS m
            INNER JOIN 
                FUNCIONARIOS f ON m.id_funcionario = f.id
            INNER JOIN 
                USUARIOS u ON f.id_usuario = u.id
        `;
        const result = await pool.query(query);
        
        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar médicos com nomes de usuários:', error);
        throw error;
    }
};

const getMedicoByCrm = async (crm) => {
    try {
        const result = await pool.query('SELECT * FROM MEDICOS WHERE CRM = $1', [crm]);
        return result.rows[0];

    } catch (error) {
        console.error('Erro ao buscar funcionário por CRM:', error);
        throw error;
    }
}

const getMedicoById = async (medicoId) => {
    try {
        const result = await pool.query('SELECT * FROM MEDICOS WHERE id = $1', [medicoId]);
        console.log(result.rows[0]);
        return result.rows[0];

    } catch (error) {
        console.error('Erro ao buscar funcionário por ID:', error);
        throw error;
    }
}

const createMedico = async (medicoData) => {
    const { funcionario, crm, especialidade, subespecialidade, universidade_graduacao, ano_conclusao, disponibilidade } = medicoData;

    try {
        const result = await pool.query(
            "INSERT INTO MEDICOS (id_funcionario, crm, especialidade, subespecialidade, universidade_grad, ano_conclusao, disponibilidade) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [funcionario, crm, especialidade, subespecialidade, universidade_graduacao, ano_conclusao, disponibilidade]
        );
        return result.rows[0];
    } catch (err) {
        console.error("Erro ao inserir médico:", err);
        throw err;
    }
}

const editMedico = async (medicoId, medicoData) => {
    const { funcionario, crm, especialidade, subespecialidade, universidade_graduacao, ano_conclusao, disponibilidade } = medicoData;

    try {
        const result = await pool.query(
            "UPDATE MEDICOS SET id_funcionario = $1, crm = $2, especialidade = $3, subespecialidade = $4, universidade_grad = $5, ano_conclusao = $6, disponibilidade = $7 WHERE id = $8 RETURNING *",
            [funcionario, crm, especialidade, subespecialidade, universidade_graduacao, ano_conclusao, disponibilidade, medicoId]
        );
        return result.rows[0];
    } catch (err) {
        console.error("Erro ao editar médico:", err);
        throw err;
    }
}

// Modelo para excluir um médico no banco de dados
const deleteMedico = async (medicoId) => {
    try {
        const result = await pool.query('DELETE FROM MEDICOS WHERE id = $1 RETURNING *', [medicoId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Buscar consultas do médico para a data especificada
const getConsultasDoDia = async (medicoId, dataConsulta) => {
    try {
        const query = `
            SELECT c.id AS id_consulta, c.horario_consulta AS horario, c.local_consulta, p.nome AS nome_paciente
                FROM consultas c
            JOIN pacientes p ON c.id_paciente = p.id
                WHERE c.id_medico = $1 AND c.data_consulta = $2;

        `;
        const result = await pool.query(query, [medicoId, dataConsulta]);
        return result.rows;
    } catch (err) {
        console.error('Erro ao buscar consultas do médico:', err);
        throw err;
    }
};

//Buscar médico pelo id do usuario
const getMedicoByIdUser = async (userId) => {
    try {
        const result = await pool.query(`
            SELECT m.id AS medico_id
            from medicos m 
            JOIN funcionarios f ON m.id_funcionario = f.id
            WHERE f.id_usuario = $1`, [userId]);

        return result.rows[0];

    } catch (error) {
        console.error('Erro ao buscar médico por id do usuário:', error);
        throw error;
    }
}

//Marcar status da consulta como realizada
const updateConsulta = async (consultaId) => {
    try {
        const result = await pool.query('UPDATE consultas SET status_consulta = consultada WHERE id = $1 RETURNING *', [consultaId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

// Model para criar um prontuário no banco de dados
const criarProntuario = async (prontuarioData) => {

    const { anamnese, peso, altura, pressao_arterial, temperatura, diagnostico_definitivo, hipoteses_diagnosticas, tratamentos_efetuados } = prontuarioData;
    console.log(prontuarioData);

    try {
        const query = `
            INSERT INTO prontuarios (
                id_paciente,
                id_medico,
                id_consulta,
                anamnese,
                peso,
                altura,
                pressao_arterial,
                temperatura,
                diagnostico_definitivo,
                hipoteses_diagnosticas,
                tratamentos_efetuados
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;
        
        const values = [
            prontuarioData.id_paciente,
            prontuarioData.id_medico,
            prontuarioData.id_consulta,
            prontuarioData.anamnese,
            prontuarioData.peso,
            prontuarioData.altura,
            prontuarioData.pressao_arterial,
            prontuarioData.temperatura,
            prontuarioData.diagnostico_definitivo,
            prontuarioData.hipoteses_diagnosticas,
            prontuarioData.tratamentos_efetuados
        ];

        const result = await pool.query(query, values);
        return result.rows[0];

    } catch (error) {
        console.error('Erro ao criar prontuário:', error);
        throw new Error('Erro ao criar prontuário: ' + error.message);
    }
};

const getConsultaById = async (consultaId) => {
    try {
        const result = await pool.query(`
            SELECT * FROM consultas WHERE id = $1`, [consultaId]);

        return result.rows[0];

    } catch (error) {
        console.error('Erro ao buscar consulta por id:', error);
        throw error;
    }
}

const getProntuariosByMedico = async (medicoId) => {
    try {
        const result = await pool.query(`
            SELECT p.*, pac.nome AS nome_paciente, c.data_consulta FROM prontuarios p 
                JOIN pacientes pac ON p.id_paciente = pac.id
                JOIN consultas c ON p.id_consulta = c.id 
            WHERE p.id_medico = $1;`, [medicoId]);

        return result.rows;

    } catch (error) {
        console.error('Erro ao buscar prontuários por id do médico:', error);
        throw error;
    }
}

const deleteProntuario = async (prontuarioId) => {
    try {
        console.log(prontuarioId);
        const result = await pool.query('DELETE FROM prontuarios WHERE id_prontuario = $1 RETURNING *', [prontuarioId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

const getProntuarioById = async (prontuarioId) => {
    try {
        const result = await pool.query(`
            SELECT * FROM prontuarios WHERE id_prontuario = $1`, [prontuarioId]);

        return result.rows[0];

    } catch (error) {
        console.error('Erro ao buscar prontuário por id:', error);
        throw error;
    }
}

const getConsultasByMedicoId = async (medicoId) => {
    try {
        const result = await pool.query(`
            SELECT c.*, p.nome AS nome_paciente FROM consultas c
            JOIN pacientes p ON c.id_paciente = p.id
            WHERE c.id_medico = $1 AND c.status_consulta = 'marcada';
        `, [medicoId]);

        return result.rows;

    } catch (error) {
        console.error('Erro ao buscar consultas por id do médico:', error);
        throw error;
    }
}

module.exports = {
    getTodosMedicos,
    getMedicoByCrm,
    createMedico,
    deleteMedico,
    getMedicoById,
    editMedico,
    getConsultasDoDia,
    getMedicoByIdUser,
    criarProntuario,
    getConsultaById,
    getProntuariosByMedico,
    deleteProntuario,
    getProntuarioById,
    getConsultasByMedicoId,
    updateConsulta
};