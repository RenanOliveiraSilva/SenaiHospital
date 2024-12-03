const pool = require('../db/conn');

// Função para adicionar um paciente ao banco de dados
const addPaciente = async (pacienteData) => {
    const {
        id_usuario,
        nome,
        idade,
        cpf,
        data_nasc,
        genero,
        relacao_paciente,
        medicamentos_paciente,
        alergias,
        doencas_existentes,
    } = pacienteData;

    try {
        const result = await pool.query(`
            INSERT INTO PACIENTES (
                id_usuario, nome, idade, cpf, data_nasc, genero, relacao_paciente, medicamentos_paciente, alergias, doencas_existentes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `, [
            id_usuario,
            nome,
            idade,
            cpf,
            data_nasc,
            genero,
            relacao_paciente,
            medicamentos_paciente,
            alergias,
            doencas_existentes,
        ]);

        return result.rows[0];
    } catch (err) {
        console.error('Erro ao adicionar paciente:', err);
        throw err;
    }
};

// Obter todos os pacientes
const getAllPacientes = async () => {
    try {
        const result = await pool.query('SELECT * FROM pacientes');
        return result.rows;
    } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
        throw err;
    }
};

// Função para obter um paciente pelo ID do usuário
const getPacienteById = async (id) => {
    try {
        const result = await pool.query(`
            SELECT p.*, u.nome AS usuario_nome 
            FROM PACIENTES p
            INNER JOIN USUARIOS u ON p.id_usuario = u.id
            WHERE p.id = $1;
        `, [id]);

        return result.rows[0];
    } catch (err) {
        console.error('Erro ao buscar paciente pelo ID:', err);
        throw err;
    }
};

//Função para obter um paciente pelo ID do usuário
const getPacienteByUserId = async (id) => {
    try {
        const result = await pool.query(`
            SELECT * FROM PACIENTES WHERE id_usuario = $1;
        `, [id]);

        return result.rows[0];
        } catch (err) {
        console.error('Erro ao buscar paciente pelo ID do usuário:', err);
        throw err;
    }
};

// Função para atualizar um paciente no banco de dados
const updatePaciente = async (id, pacienteData) => {
    const {
        id_usuario,
        nome,
        idade,
        cpf,
        data_nasc,
        genero,
        relacao_paciente,
        medicamentos_paciente,
        alergias,
        doencas_existentes,
    } = pacienteData;

    try {
        const result = await pool.query(`
            UPDATE PACIENTES SET
                id_usuario = $1,
                nome = $2,
                idade = $3,
                cpf = $4,
                data_nasc = $5,
                genero = $6,
                relacao_paciente = $7,
                medicamentos_paciente = $8,
                alergias = $9,
                doencas_existentes = $10
            WHERE id = $11
            RETURNING *;
        `, [
            id_usuario,
            nome,
            idade,
            cpf,
            data_nasc,
            genero,
            relacao_paciente,
            medicamentos_paciente,
            alergias,
            doencas_existentes,
            id,
        ]);

        return result.rows[0];
    } catch (err) {
        console.error('Erro ao atualizar paciente:', err);
        throw err;
    }
};

// Remover Paciente
const deletePaciente = async (id) => {
    try {
        await pool.query('DELETE FROM pacientes WHERE id = $1', [id]);
    } catch (err) {
        console.error('Erro ao deletar paciente:', err);
        throw err;
    }
};

const getDiasDisponiveis = async (medicoId) => {
    try {
        // Consulta para pegar as datas das consultas agendadas para o médico
        const query = `
            SELECT DISTINCT data_consulta
            FROM consultas
            WHERE id_medico = $1
            AND data_consulta BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '10 days');
        `;

        const result = await pool.query(query, [medicoId]);

        // Cria um conjunto (Set) de datas ocupadas, usando o formato YYYY-MM-DD
        const datasOcupadas = new Set(result.rows.map(row => row.data_consulta.toISOString().split('T')[0]));

        // Verifica os dias dentro do período de 10 dias, excluindo sábados e domingos
        const diasDisponiveis = [];
        for (let i = 0; diasDisponiveis.length < 10; i++) {
            const dia = new Date();
            dia.setDate(dia.getDate() + i);

            // Verifica se é sábado ou domingo (0 = domingo, 6 = sábado)
            const dayOfWeek = dia.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                continue; // Ignora sábados e domingos
            }

            const diaString = dia.toISOString().split('T')[0]; // Formato YYYY-MM-DD

            // Adiciona o dia à lista de dias disponíveis, independente de estar ocupado ou não
            diasDisponiveis.push(diaString);
        }

        return diasDisponiveis;
    } catch (err) {
        console.error('Erro ao buscar dias disponíveis:', err);
        throw err;
    }
};



// Função para obter médicos disponíveis em determinada data e local
const getMedicosDisponiveis = async ( ) => {
    try {
        const result = await pool.query(`
           SELECT m.id AS medico_id, u.nome AS medico_nome
            FROM medicos m
            JOIN funcionarios f ON m.id_funcionario = f.id
            JOIN usuarios u ON f.id_usuario = u.id;
        `);

        return result.rows;
    } catch (err) {
        console.error('Erro ao buscar médicos disponíveis:', err);
        throw err;
    }
};

const getHorariosDisponiveis = async (medicoId, dataConsulta) => {
    try {
        const query = `
            SELECT horario_consulta AS horario
            FROM consultas
            WHERE id_medico = $1
            AND data_consulta = $2;
        `;

        const result = await pool.query(query, [medicoId, dataConsulta]);

        // Obtendo os horários ocupados, padronizando o formato como 'HH:MM'
        const horariosOcupados = result.rows.map(row => row.horario.trim());

        // Definindo os horários fixos disponíveis
        const horarios = ['08:00', '12:00', '14:00', '16:00'];

        // Filtrando os horários para desabilitar os já ocupados
        const horariosDisponiveis = horarios.map(horario => {
            return {
                horario,
                disponivel: !horariosOcupados.includes(horario)
            };
        });

        return horariosDisponiveis;
    } catch (err) {
        console.error('Erro ao buscar horários disponíveis:', err);
        throw err;
    }
};

// Função para agendar uma consulta (inserir no banco de dados)
const agendarConsulta = async (dataConsulta) => {
    const { data, horario, medicoId, localConsulta, pacienteId } = dataConsulta;

    try {
        const query = `
            INSERT INTO consultas (data_consulta, horario_consulta, id_medico, local_consulta, id_paciente)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [data, horario, medicoId, localConsulta, pacienteId];

        // Executa a query de inserção
        await pool.query(query, values);
        return { message: "Consulta agendada com sucesso." };
    } catch (error) {
        console.error('Erro ao agendar consulta:', error);
        throw new Error("Erro ao agendar consulta.");
    }
};

module.exports = {
    addPaciente,
    getAllPacientes,
    getPacienteById,
    updatePaciente,
    deletePaciente,
    agendarConsulta,
    getMedicosDisponiveis,
    getDiasDisponiveis,
    getHorariosDisponiveis,
    getPacienteByUserId
    
};