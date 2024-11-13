var express = require('express');
const usuarioController = require('../controller/usuario.controller');
const { authMiddleware } = require('../middleWare/authMiddleware');

const router = express.Router();

// Renderizando a página home
router.get('/', usuarioController.renderizaLanding);


router
    .get('/login', usuarioController.renderizaFormLogin) //Rendezirando Login
    .post('/login', usuarioController.logarUsuario); //Validação de Usuário


//Validação do usuário
router
    .get('/home/index', usuarioController.renderizaHome, authMiddleware)
    .post('/cad_user', authMiddleware, usuarioController.inserirUsuarios);


    router.post('/home/index/verifyToken', (req, res) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
  
      if (!token) {
          return res.sendStatus(401); // Token não fornecido
      }
  
      jwt.verify(token, 'CUBOMAGICO', (err, user) => {
          if (err) {
              return res.sendStatus(403); // Token inválido
          }
          res.sendStatus(200); // Token válido
      });
  });


module.exports = router;
