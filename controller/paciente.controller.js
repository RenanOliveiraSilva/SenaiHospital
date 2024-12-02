const PacienteModel = require('../model/paciente.model');

// Função para cadastrar um novo paciente
const postPaciente = async (req, res) => {
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
    } = req.body;

    const t  = req.params.t;
    console.log(t)

    // Validações de campos em branco
    if (
        !id_usuario ||
        !nome ||
        !idade ||
        !cpf ||
        !data_nasc ||
        !genero ||
        !relacao_paciente ||
        !medicamentos_paciente ||
        !alergias ||
        !doencas_existentes
    ) {
        return res.status(400).json({ message: 'Preencha todos os campos!' });
    }

    try {
        // Verifica se o CPF já está cadastrado
        const pacienteExistenteCpf = await PacienteModel.getPacienteByCpf(cpf);
        if (pacienteExistenteCpf) {
            return res.status(409).json({ message: 'CPF já cadastrado!' });
        }

        // Cadastra o paciente
        const novoPaciente = await PacienteModel.addPaciente({
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
        });

        if (!novoPaciente) {
            return res.status(500).json({ message: 'Erro ao cadastrar paciente' });
        }

        if (t == 1) {
            res.status(200).json({ redirect: "/home/home-administrador" });
        } else {
            // Redireciona após o cadastro
            res.status(200).json({ redirect: "/home/home-funcionario" });
        }

    } catch (error) {
        console.error('Erro ao cadastrar paciente:', error);
        res.status(500).json({ error: error.message });
    }
};


// Obter Todos os Pacientes
const getPacientes = async (req, res) => {
    try {
        const pacientes = await PacienteModel.getAllPacientes();
        res.status(200).json(pacientes);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar pacientes' });
    }
};

// Obter Paciente por ID
const getPaciente = async (req, res) => {
    try {
        const paciente = await PacienteModel.getPacienteById(req.params.id);
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente não encontrado' });
        }
        res.status(200).json(paciente);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar paciente' });
    }
};

// Função para renderizar a página de edição do paciente
const getEditarPaciente = async (req, res) => {
    try {
        const id = req.params.id;
        const paciente = await PacienteModel.getPacienteById(id);

        if (!paciente) {
            return res.status(404).send('Paciente não encontrado');
        }

        // Renderiza a view de edição do paciente com os dados do paciente atual
        res.render('home/editar_paciente', { paciente });

    } catch (error) {
        console.error('Erro ao buscar paciente:', error);
        res.status(500).send('Erro ao buscar paciente');
    }
};

// Função do controller para atualizar um paciente
const putPaciente = async (req, res) => {
    const { id } = req.params;
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
    } = req.body;

    // Validações de campos em branco
    if (
        !id_usuario || !nome || !idade || !cpf || !data_nasc || !genero ||
        !relacao_paciente || !medicamentos_paciente || !alergias || !doencas_existentes
    ) {
        return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    try {
        // Atualiza o paciente
        const pacienteAtualizado = await PacienteModel.updatePaciente(id, {
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
        });

        if (!pacienteAtualizado) {
            return res.status(404).json({ message: "Paciente não encontrado" });
        }

        // Redireciona após o editar
        res.redirect("/home/home-administrador");

    } catch (error) {
        console.error('Erro ao atualizar paciente:', error);
        res.status(500).json({ error: error.message });
    }
};

// Deletar Paciente
const deletePaciente = async (req, res) => {
    try {
        await PacienteModel.deletePaciente(req.params.id);
        // Redireciona para a listagem de usuários após a exclusão
        res.redirect('/home/home-administrador');
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar paciente' });
    }
};

const renderizaHomePaciente = async (req, res) => {
    try {

        res.render('./homeUsuario/home-paciente');

    } catch (err) {
        res.status(500).json({ error: 'Erro ao renderizar página' });
    }
};

// Renderizar a página de agendamento de consulta
const renderizarAgendamentoConsulta = (req, res) => {
    res.render('./homeUsuario/agendar-consulta');
};

// Função para obter médicos disponíveis em uma data específica
const getMedicosDisponiveis = async (req, res) => {
    const { data } = req.query;

    try {
        const medicos = await PacienteModel.getMedicosDisponiveis(data);
        res.status(200).json(medicos);
    } catch (error) {
        console.error('Erro ao buscar médicos disponíveis:', error);
        res.status(500).json({ message: 'Erro ao buscar médicos disponíveis' });
    }
};

// Função para obter horários disponíveis para um médico específico
const getHorariosDisponiveis = async (req, res) => {
    const { data, medicoId } = req.query;

    try {
        const horarios = await PacienteModel.getHorariosDisponiveis(data, medicoId);
        res.status(200).json(horarios);
    } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        res.status(500).json({ message: 'Erro ao buscar horários disponíveis' });
    }
};

// Função para agendar uma consulta
const agendarConsulta = async (req, res) => {
    const consultaData = req.body;

    try {
        const consulta = await PacienteModel.agendarConsulta(consultaData);
        res.status(200).json(consulta);
    } catch (error) {
        console.error('Erro ao agendar consulta:', error);
        res.status(500).json({ message: 'Erro ao agendar consulta' });
    }
};

module.exports = {
    postPaciente,
    getPacientes,
    getPaciente,
    putPaciente,
    deletePaciente,
    getEditarPaciente,
    renderizaHomePaciente,
    renderizarAgendamentoConsulta,
    getMedicosDisponiveis,
    getHorariosDisponiveis,
    agendarConsulta
};
