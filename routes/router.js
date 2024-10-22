var express = require('express');
const router = express.Router();

// Renderizando a página home
router.get('/', function(req, res, next) {
  res.render('index');
});

// Renderizando a página login
router.get('/login', function(req, res, next) {
  res.render('login');
})

module.exports = router;
