const pool = require('../db/conn');

const getFuncinariosMedicos = async () => {
    try {
        const result = await pool.query(`
           SELECT 
            f.id,
            u.nome,
            u.id AS id_user
        FROM 
            FUNCIONARIOS f
        INNER JOIN
            USUARIOS u ON f.id_usuario = u.id
        LEFT JOIN
            MEDICOS m ON f.id = m.id_funcionario
        WHERE 
            f.cargo = 'M' AND m.id_funcionario IS NULL;


        `);
        return result.rows;
        
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        throw err;
    }
};

// Função para buscar um funcionário pelo ID
const getFuncionarioById = async (id) => {
    try {
        const result = await pool.query(`
        SELECT
            f.id, u.nome
        FROM 
            funcionarios f
        INNER JOIN 
            usuarios u ON f.id_usuario = u.id
        WHERE
            f.id = $1;
        `, [id]);
        
        return result.rows[0];


    } catch (error) {
        console.error('Erro ao buscar funcionário pelo ID:', error);
        throw error; // Lança o erro para ser tratado pela lógica do controlador
    }
};

// Cria um novo funcionário
const createFuncionario = async (funcionarioData) => {
    try {
        const { nome, cpf, cargo, salario, data_admissao, id_usuario } = funcionarioData;
        const result = await pool.query(`
            INSERT INTO funcionarios (nome, cpf, cargo, salario, data_admissao, id_usuario)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [nome, cpf, cargo, salario, data_admissao, id_usuario]);
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao criar funcionário:', error);
        throw error;
    }
};

// Obtém todos os funcionários
const getAllFuncionarios = async () => {
    try {
        const result = await pool.query('SELECT * FROM funcionarios');
        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        throw error;
    }
};

// Atualiza um funcionário
const updateFuncionario = async (id, funcionarioData) => {
    try {
        const { nome, cpf, cargo, salario, data_admissao } = funcionarioData;
        const result = await pool.query(`
            UPDATE funcionarios
            SET nome = $1, cpf = $2, cargo = $3, salario = $4, data_admissao = $5
            WHERE id = $6
            RETURNING *;
        `, [nome, cpf, cargo, salario, data_admissao, id]);
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        throw error;
    }
};

// Exclui um funcionário
const deleteFuncionario = async (id) => {
    try {
        const result = await pool.query(`
            DELETE FROM funcionarios WHERE id = $1 RETURNING * ;
        `, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        throw error;
    }
};


module.exports = {
    getFuncinariosMedicos,
    createFuncionario,
    getFuncionarioById,
    getAllFuncionarios,
    updateFuncionario,
    deleteFuncionario
    
}
