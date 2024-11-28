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


module.exports = {
    postMedico,
    excluirMedico,
    getEditarMedico,
    postEditarMedico
};
