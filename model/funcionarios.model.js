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
const getFuncionarioByIdUser = async (id) => {
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
        const { cargo, salario, data_admissao, id_usuario } = funcionarioData;

        const result = await pool.query(`
            INSERT INTO funcionarios (cargo, salario, data_admissao, id_usuario)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [cargo, salario, data_admissao, id_usuario]);

        return result.rows[0];
    } catch (error) {
        console.error('Erro ao criar funcionário:', error);
        throw error;
    }
};

// Obtém todos os funcionários
const getAllFuncionarios = async () => {
    try {
        const result = await pool.query(`
            SELECT 
                f.*, 
                u.nome AS nome_usuario
            FROM 
                funcionarios f
            INNER JOIN 
                usuarios u ON f.id_usuario = u.id
        `);
        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        throw error;
    }
};

// Atualiza um funcionário
const updateFuncionario = async (id, funcionarioData) => {
    try {
        // Desestrutura os dados que queremos atualizar do objeto 'funcionarioData'
        const { cargo, salario, data_admissao } = funcionarioData;

        // Executa a consulta SQL para atualizar o funcionário
        const result = await pool.query(`
            UPDATE funcionarios
            SET 
                cargo = $1,
                salario = $2,
                data_admissao = $3
            WHERE 
                id = $4
            RETURNING *;
        `, [cargo, salario, data_admissao, id]);

        // Retorna os dados do funcionário atualizado
        return result.rows[0];

    } catch (err) {
        console.error('Erro ao atualizar funcionário:', err);
        throw err;
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

// Modelo para buscar um funcionário pelo ID
const getFuncionarioById = async (id) => {
    try {
        // Query para buscar os detalhes do funcionário pelo ID
        const result = await pool.query(`
            SELECT 
                f.id AS funcionario_id, 
                f.cargo, 
                f.salario, 
                f.data_admissao, 
                f.id_usuario, 
                u.nome
            FROM 
                funcionarios f
            INNER JOIN 
                usuarios u ON f.id_usuario = u.id
            WHERE 
                f.id = $1
        `, [id]);

        // Se não encontrar o funcionário, lançar um erro
        if (result.rows.length === 0) {
            throw new Error(`Funcionário com o ID ${id} não encontrado.`);
        }

        // Retornar os dados do funcionário encontrado
        return result.rows[0];

    } catch (err) {
        console.error('Erro ao buscar funcionário pelo ID:', err);
        throw err;
    }
};


module.exports = {
    getFuncinariosMedicos,
    createFuncionario,
    getFuncionarioByIdUser,
    getFuncionarioById,
    getAllFuncionarios,
    updateFuncionario,
    deleteFuncionario
    
}
