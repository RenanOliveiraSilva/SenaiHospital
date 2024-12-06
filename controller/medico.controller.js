const medicoModel = require('../model/medicos.model');
const usuarioModel = require('../model/usuario.model');
const pacienteModel = require('../model/paciente.model');
const funcModel = require('../model/funcionarios.model');

// Inserção de médico no banco de dados
const postMedico = async (req, res) => {
    const { funcionario, crm, especialidade, subespecialidade, universidade_graduacao, ano_conclusao, disponibilidade } = req.body;

    // Validações de campos em branco
    if (!funcionario || !crm || !especialidade || !universidade_graduacao || !ano_conclusao || !disponibilidade) {
        return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    try {
        // Verifica se o CRM já está cadastrado
        const medicoExistenteCrm = await medicoModel.getMedicoByCrm(crm);
        if (medicoExistenteCrm) {
            return res.status(409).json({ message: "CRM já cadastrado!" });
        }

        // Cria o médico
        const novoMedico = await medicoModel.createMedico({
            funcionario,
            crm,
            especialidade,
            subespecialidade,
            universidade_graduacao,
            ano_conclusao,
            disponibilidade
        });

        if (!novoMedico) {
            return res.status(400).json({ message: "Erro ao cadastrar médico" });
        }

        // Redireciona após o cadastro
        res.redirect("/home/home-administrador");
    } catch (error) {
        console.error('Erro ao criar médico:', error);
        res.status(500).json({ error: error.message });
    }
};

// Função para renderizar a página de edição do usuário
const getEditarMedico = async (req, res) => {
    
    try {
        const medicoId = req.params.id;
        const medico = await medicoModel.getMedicoById(medicoId);
        const funcionario = await funcModel.getFuncionarioByIdUser(medico.id_funcionario);

        if (!medico) {
            return res.status(404).send('Médico não encontrado');
        }

        // Renderiza a view de edição do usuário com os dados do usuário atual
        res.render('home/editar_medico', { medico, funcionario });

    } catch (error) {
        console.error('Erro ao buscar medico:', error);
        res.status(500).send('Erro ao buscar medico');
    }
};

const postEditarMedico = async (req, res) => {
    const { funcionario, crm, especialidade, subespecialidade, universidade_graduacao, ano_conclusao, disponibilidade } = req.body;
    const medicoId = req.params.id;

    console.log(req.body);

    // Validações de campos em branco
    if (!funcionario || !crm || !especialidade || !universidade_graduacao || !ano_conclusao || !disponibilidade) {
        return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    try {
        
        // Cria o médico
        const editMedico = await medicoModel.editMedico(medicoId,{
            funcionario,
            crm,
            especialidade,
            subespecialidade,
            universidade_graduacao,
            ano_conclusao,
            disponibilidade
        });

        if (!editMedico) {
            return res.status(400).json({ message: "Erro ao editar médico" });
        }

        // Redireciona após o editar
        res.redirect("/home/home-administrador");
    } catch (error) {
        console.error('Erro ao editar:', error);
        res.status(500).json({ error: error.message });
    }
}


// Exclusão de médico no banco de dados
const excluirMedico = async (req, res) => {
    try {
        const medicoId = req.params.id;

        // Chama o modelo para excluir o usuário
        const medicoExcluido = await medicoModel.deleteMedico(medicoId);

        if (!medicoExcluido) {
            return res.status(404).json({ message: 'Médico não encontrado!' });
        }

        // Redireciona para a listagem de usuários após a exclusão
        res.redirect('/home/home-administrador');
    } catch (error) {
        console.error('Erro ao excluir médico:', error);
        res.status(500).json({ error: 'Erro ao excluir médico' });
    }
};

const renderizaHomeMedico = (req, res) => {
    try {
        const medicoId = req.query.id; // Assumindo que o ID do médico está sendo passado pela URL


        // Renderiza a home do médico
        res.render('./homeMedico/home-medico', { medicoId });
    } catch (error) {
        console.error('Erro ao renderizar home do médico:', error);
        res.status(500).send('Erro ao renderizar home do médico');
    }
};

// Buscar consultas do médico para a data especificada
const getConsultasDoDia = async (req, res) => {
    const userId = req.query.idMedico;  // Assumindo que o médico já está autenticado e seu ID está disponível
    const dataConsulta = req.query.dataConsulta;

    const medico = await medicoModel.getMedicoByIdUser(userId);
    const id = medico.medico_id;


    try {
        const consultas = await medicoModel.getConsultasDoDia(id, dataConsulta);
        res.status(200).json(consultas);
    } catch (err) {
        console.error('Erro ao buscar consultas do médico:', err);
        res.status(500).json({ error: 'Erro ao buscar consultas do médico' });
    }
};

// Renderizar a página de consultas do médico
const renderizarConsultasMedico = (req, res) => {
    const idMedico = req.query.id; // Assumindo que o ID do médico está sendo passado pela URL

    if (!idMedico) {
        return res.status(400).send('ID do médico não fornecido');
    }

    // Renderizar a página, passando o ID do médico para o template, se necessário
    res.render('./homeMedico/gerenciar-consulta', { idMedico });
};

//Renderizar a página de prontuário do médico
const renderizarProntuario = async (req, res) => {
    try {
        const id_consulta = req.query.id; // Assumindo que o ID do médico está sendo passado pela URL
        const consulta = await medicoModel.getConsultaById(id_consulta);
        const usuario = await pacienteModel.getPacienteById(consulta.id_paciente);

        console.log(usuario);

        res.render('./homeMedico/prontuario', { consulta, usuario });

    } catch (error) {
        console.error('Erro ao renderizar prontuário do médico:', error);
        res.status(500).send('Erro ao renderizar prontuário do médico');
    }
}

// Controller para criar um prontuário
const criarProntuario = async (req, res) => {
    // Desestruturação dos dados do corpo da requisição
    const {
        anamnese,
        peso,
        altura,
        pressao_arterial,
        temperatura,
        diagnostico_definitivo,
        hipoteses_diagnosticas,
        tratamentos_efetuados
    } = req.body;
    
    const { id_consulta, id_medico, id_paciente } = req.query;

    try {
        // Passando os dados para o modelo
        const novoProntuario = await medicoModel.criarProntuario({
            id_paciente,
            id_medico,
            id_consulta,
            anamnese,
            peso,
            altura,
            pressao_arterial,
            temperatura,
            diagnostico_definitivo,
            hipoteses_diagnosticas,
            tratamentos_efetuados
        });

        await medicoModel.updateConsulta(id_consulta);

        res.status(201).json(novoProntuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar prontuário.' });
    }
};

//Buscar pontruários com id do médico
const renderizarListaProntuario = async (req, res) => {
    try {
        const id_usuario = req.query.id; // Assumindo que o ID do médico está sendo passado pela URL
        const medico = await medicoModel.getMedicoByIdUser(id_usuario);
        
        const prontuarios = await medicoModel.getProntuariosByMedico(medico.medico_id);
        
        res.render('./homeMedico/lista-prontuarios', { prontuarios, medico, id_usuario });
    } catch (error) {
        console.error('Erro ao buscar prontuários do médico:', error);
        res.status(500).send('Erro ao buscar prontuários do médico');
    }
}

//Rota para deletar pontruários
const deleteProntuario = async (req, res) => {
    try {
        const prontuarioId = req.params.id;
        console.log(prontuarioId);

        const prontuarioExcluido = await medicoModel.deleteProntuario(prontuarioId);

        if (!prontuarioExcluido) {
            return res.status(404).json({ message: 'Prontuário não encontrado!' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir prontuário:', error);
        res.status(500).json({ error: 'Erro ao excluir prontuário' });
    }
};

const visualizarProntuario = async (req, res) => {
    try {
        const id_prontuario = req.params.id; // Assumindo que o ID do médico está sendo passado pela URL
        const prontuario = await medicoModel.getProntuarioById(id_prontuario);
        const paciente = await pacienteModel.getPacienteById(prontuario.id_paciente);

        res.render('./homeMedico/prontuario-visualizar', { prontuario, paciente });
    } catch (error) {
        console.error('Erro ao visualizar prontuário do médico:', error);
        res.status(500).send('Erro ao visualizar prontuário do médico');
    }
}

const visualizarConsultas = async (req, res) => {
    try {
        const id_usuario = req.params.id;
        const medico = await medicoModel.getMedicoByIdUser(id_usuario);
        const consultas = await medicoModel.getConsultasByMedicoId(medico.medico_id);

        res.render('./homeMedico/consulta-visualizar', { consultas });
    } catch (error) {
        console.error('Erro ao buscar consultas:', error);
        res.status(500).send('Erro ao buscar consultas');
    }
};

module.exports = {
    postMedico,
    excluirMedico,
    getEditarMedico,
    postEditarMedico,
    renderizaHomeMedico,
    getConsultasDoDia,
    renderizarConsultasMedico,
    renderizarProntuario,
    criarProntuario,
    renderizarListaProntuario,
    deleteProntuario,
    visualizarProntuario,
    visualizarConsultas
};
