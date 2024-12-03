const medicoModel = require('../model/medicos.model');
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
    const medicoId = req.query.idMedico;  // Assumindo que o médico já está autenticado e seu ID está disponível
    const dataConsulta = req.query.dataConsulta;
    
    const medico = await medicoModel.getMedicoById(medicoId);
    const id = medico.id;

    console.log(medico);

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

module.exports = {
    postMedico,
    excluirMedico,
    getEditarMedico,
    postEditarMedico,
    renderizaHomeMedico,
    getConsultasDoDia,
    renderizarConsultasMedico
};
