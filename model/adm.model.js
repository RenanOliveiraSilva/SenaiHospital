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


module.exports = {
    getFuncinariosMedicos,
    createFuncionario
}
