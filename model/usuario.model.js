// model/exampleModel.js
const pool = require('../db/conn');

// Exemplo de função para buscar dados
const getTodosUsuarios = async () => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        return result.rows;
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        throw err;
    }
};

module.exports = {
    getTodosUsuarios,
};