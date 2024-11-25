const pool = require('../db/conn');

// Listagem de Todos os Usuários
const getTodosUsuarios = async () => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        return result.rows;
        
    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        throw err;
    }
};

// Listagem de Usuário por email
const getUsuarioByEmail = async (email) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);   
        
        // Verificar se algum usuário foi encontrado
        if (result.rows.length === 0) { 
            return null; // Retornar null se o usuário não for encontrado
        }

        return result.rows[0]; // Retornar a linha completa do usuário encontrado

    } catch (err) {
        console.error('Erro ao buscar dados:', err);
        throw err;
    }
};

// Inserir usuário no banco de dados
const createUsuario = async (userData) => {
    const { 
        nome, 
        cpf, 
        email, 
        senha, 
        mapa, 
        contato, 
        numero_casa, 
        rua, 
        bairro, 
        cidade, 
        data_nasc 
    } = userData;

    console.log("Data: ", userData);
    
    try {
        const result = await pool.query(
            "INSERT INTO usuarios (nome, cpf, email, senha, mapa, contato, numero_casa, rua, bairro, cidade, data_nasc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
            [nome, cpf, email, senha, mapa, contato, numero_casa, rua, bairro, cidade, data_nasc]
        );
        return result.rows[0];
    } catch (err) {
        console.error("Erro ao inserir usuário:", err);
        throw err;
    }
};

module.exports = { createUsuario };

module.exports = {
    getTodosUsuarios,
    getUsuarioByEmail,
    createUsuario
};