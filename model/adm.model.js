const pool = require('../db/conn');

const getTodosFuncionarios = async () => {
    try {
        const result = await pool.query('SELECT * FROM funcionarios');
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


module.exports = {
    getTodosFuncionarios,
    createFuncionario
}
