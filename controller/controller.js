

//Renderiza Landing
const renderizaLanding = async (req, res) => {
    try {
       res.render('./landing/index')

    } catch (err) {
        res.status(404).send('Rota não encontrada');
    }
}



module.exports = {
    renderizaLanding
};