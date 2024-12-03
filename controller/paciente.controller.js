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
    const id = req.params.id;

    try {

        res.render('./homeUsuario/home-paciente', { id });

    } catch (err) {
        res.status(500).json({ error: 'Erro ao renderizar página' });
    }
};

// Renderizar a página de agendamento de consulta
const renderizarAgendamentoConsulta = async (req, res) => {
    const id = req.query.id;  // Aqui pegamos o valor do id da query string da URL

    try {
        // Buscar o paciente pelo ID do usuário
        const idPaciente = await PacienteModel.getPacienteByUserId(id);

        if (!idPaciente) {
            return res.status(404).send('Paciente não encontrado');
        }

        // Renderizar a página com o ID do paciente
        res.render('./homeUsuario/agendar-consulta', { idPaciente });
    } catch (err) {
        console.error('Erro ao renderizar página:', err);
        res.status(500).json({ error: 'Erro ao renderizar página' });
    }
};


// Função para obter médicos disponíveis em uma data específica
const getMedicosDisponiveis = async (req, res) => {

    try {
        const medicos = await PacienteModel.getMedicosDisponiveis( );
        res.status(200).json(medicos);
    } catch (error) {
        console.error('Erro ao buscar médicos disponíveis:', error);
        res.status(500).json({ message: 'Erro ao buscar médicos disponíveis' });
    }
};

const getDiasDisponiveis = async (req, res) => {
    const { medicoId } = req.query;

    if (!medicoId) {
        return res.status(400).json({ message: 'Id do médico é obrigatório' });
    }

    try {
        const diasDisponiveis = await PacienteModel.getDiasDisponiveis(medicoId);
        res.status(200).json(diasDisponiveis);
    } catch (error) {
        console.error('Erro ao buscar dias disponíveis:', error);
        res.status(500).json({ message: 'Erro ao buscar dias disponíveis' });
    }
};

const getHorariosDisponiveis = async (req, res) => {
    try {
        const { medicoId, dataConsulta } = req.query;

        if (!medicoId || !dataConsulta) {
            return res.status(400).json({ message: 'Médico e data são obrigatórios' });
        }

        const horariosDisponiveis = await PacienteModel.getHorariosDisponiveis(medicoId, dataConsulta);
        res.status(200).json(horariosDisponiveis);
    } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        res.status(500).json({ message: 'Erro ao buscar horários disponíveis' });
    }
};

// Função do controller para agendar consulta
const agendarConsulta = async (req, res) => {
    try {
        const { data, horario, medicoId, id_usuario } = req.body;
        const localConsulta = 'Guará';

        const medicoIdFormatado = parseInt(medicoId);

        // Busca o ID do paciente na sessão
        const paciente = await PacienteModel.getPacienteByUserId(id_usuario);
        const pacienteId = paciente.id;

        // Validação básica dos dados recebidos
        if (!data || !horario || !medicoId || !localConsulta || !pacienteId) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        // Chama a função do model para agendar a consulta
        const result = await PacienteModel.agendarConsulta({ data, horario, medicoId: medicoIdFormatado, localConsulta, pacienteId });

        
        // Retorna sucesso
        res.redirect('/home/home-paciente/' + id_usuario);

    } catch (error) {
        console.error('Erro no controller ao agendar consulta:', error);
        return res.status(500).json({ message: error.message });
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
    getDiasDisponiveis,
    agendarConsulta,
    getHorariosDisponiveis
};
