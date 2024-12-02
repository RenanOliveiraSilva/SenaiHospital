const userModel = require('../model/usuario.model');
const medicoModel = require('../model/medicos.model');
const funcModel = require('../model/funcionarios.model');
const PacienteModel = require('../model/paciente.model');

//Renderiza Cadastro_medico
const renderizaCadMedico = async (req, res) => {
    try {
        const funcionarios = await funcModel.getFuncinariosMedicos();

       res.render('./home/cadastrar_medico', { funcionarios })

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza Cadastro_User
const renderizaCadUser = async (req, res) => {
    try {
        const { t } = req.params;
       res.render('./home/cadastrar_user', { t })

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza home administrador
const renderizaHome = async (req, res) => {
    try {
       res.render('./home/home-administrador')

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza home administrador
const renderizaCadPaciente = async (req, res) => {
    try {
        const usuarios = await userModel.getUsuarioSemPaciente();
        const { t } = req.params;
       res.render('./home/cadastrar_paciente', { usuarios, t })

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza home administrador
const renderizaGerenciarUser = async (req, res) => {
    try {
    const usuarios = await userModel.getTodosUsuarios();
       res.render('./home/gerenciar_usuario', { usuarios })

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza home administrador
const renderizaListaMed = async (req, res) => {
    try {
        const medicos = await medicoModel.getTodosMedicos();
        res.render('./home/gerenciar_medicos', { medicos })

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza tela de listagem de funcionarios
const renderizaListaFunc = async (req, res) => {
    try {
        const funcionarios = await funcModel.getAllFuncionarios();
        res.render('./home/gerenciar_funcionario', { funcionarios })

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

//Renderiza tela de cadastrar funcionario
const renderizaCadFunc = async (req, res) => {
    try {
        const usuarios = await userModel.getUsuariosSemFuncionario();
        res.render('./home/cadastrar_funcionario', { usuarios })

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}

// Renderizar Página de Lista de Pacientes
const renderizaListaPacientes = async (req, res) => {
    try {
        const pacientes = await PacienteModel.getAllPacientes();
        console.log(pacientes);
        res.render('./home/gerenciar_pacientes', { pacientes });
    } catch (err) {
        console.error('Erro ao renderizar a lista de pacientes:', err);
        res.status(500).send('Erro ao renderizar a lista de pacientes');
    }
};

module.exports = {
    renderizaCadMedico,
    renderizaCadUser,
    renderizaCadFunc,
    renderizaCadPaciente,
    renderizaHome,
    renderizaGerenciarUser,
    renderizaListaMed,
    renderizaListaFunc,
    renderizaListaPacientes
};
