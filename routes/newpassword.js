// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const resetController = require('../controllers/resetController');
const auth = require('../middleware/auth');

// Iniciar sesión
// api/reset
router.post('/', 
    resetController.actualizarPassword
)
module.exports = router;