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

// Listagem de Usuários que Não Estão na Tabela Funcionários
const getUsuariosSemFuncionario = async () => {
    try {
        const result = await pool.query(`
            SELECT 
                u.id AS usuario_id, 
                u.nome, 
                u.email,
                u.cpf,
                f.id AS funcionario_id
            FROM usuarios u
            LEFT JOIN funcionarios f ON u.id = f.id_usuario
            WHERE f.id_usuario IS NULL
            AND u.mapa <> 'A'
        `);

        console.log(result.rows);

        return result.rows;
    } catch (err) {
        console.error('Erro ao buscar usuários sem vínculo na tabela funcionários:', err);
        throw err;
    }
};


// Model para buscar usuário pelo CPF
const getUsuarioByCpf = async (cpf) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE cpf = $1', [cpf]);
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao buscar usuário por CPF:', error);
        throw error;
    }
};

// Model para buscar usuário pelo e-mail
const getUsuarioByEmail = async (email) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao buscar usuário por e-mail:', error);
        throw error;
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

// Função para buscar um usuário pelo ID
const getUsuarioById = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao buscar usuário por ID:', error);
        throw error;
    }
};

// Função para atualizar os dados do usuário no banco de dados
const updateUsuario = async (usuarioId, dadosUsuario) => {
    const {
        nome,
        senha,
        email,
        mapa,
        contato,
        numero_casa,
        rua,
        bairro,
        cidade,
        data_nasc,
    } = dadosUsuario;

    try {
        const result = await pool.query(
            `UPDATE usuarios 
             SET nome = $1, email = $2, senha = $3, mapa = $4, contato = $5,
                 numero_casa = $6, rua = $7, bairro = $8, cidade = $9, data_nasc = $10
             WHERE id = $11 RETURNING *`,
            [nome, email, senha, mapa, contato, numero_casa, rua, bairro, cidade, data_nasc, usuarioId]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Erro ao atualizar usuário no banco de dados:', error);
        throw error;
    }
};

// Modelo para excluir um usuário no banco de dados
const deleteUsuario = async (usuarioId) => {
    try {
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [usuarioId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getTodosUsuarios,
    getUsuarioByEmail,
    getUsuariosSemFuncionario,
    createUsuario,
    getUsuarioById,
    updateUsuario,
    getUsuarioByCpf,
    deleteUsuario
};