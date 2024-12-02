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


module.exports = {
    getTodosMedicos,
    getMedicoByCrm,
    createMedico,
    deleteMedico,
    getMedicoById,
    editMedico
};