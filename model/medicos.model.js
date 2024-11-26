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


module.exports = {
    getTodosMedicos
};