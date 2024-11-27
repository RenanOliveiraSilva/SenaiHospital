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

// Inserir funcionário no banco de dados
const createFuncionario = async (funcionarioData) => {
    const { salario, data_admissao, id_usuario } = funcionarioData;

    try {
        const result = await pool.query(
            "INSERT INTO funcionarios (salario, data_admissao, id_usuario) VALUES ($1, $2, $3) RETURNING *",
            [salario, data_admissao, id_usuario]
        );
        return result.rows[0];
    } catch (err) {
        console.error("Erro ao inserir funcionário:", err);
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


module.exports = {
    getFuncinariosMedicos,
    createFuncionario,
    getFuncionarioById
}
