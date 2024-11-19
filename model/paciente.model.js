const pool = require('../db/conn');

const postPaciente = async (pacienteData) => {
    const {
        patientName,
        cpf,
        birthDate,
        gender,
        fullName,
        relationship,
        contact,
        diseases,
        allergies,
        medicines,
    } = pacienteData;

    try{
        const id_usuario = await pool.query(
            "SELECT id FROM USUARIOS WHERE nome = $1", [fullName]
        );

        if (!id_usuario) {
            return null;
        }
    } catch {
        console.error('Erro ao buscar usuario:', err);
    throw err;
    }

    try {
        const result = await pool.query(
            "INSERT INTO PACIENTES (id_usuario, nome, idade, data_nasc, genero, relacao_paciente, medicamentos_paciente, alergias, doencas_existentes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [id_usuario, patientName, ]
        )
    } catch {

    }
}
