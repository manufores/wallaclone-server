// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const resetController = require('../controllers/resetController');
const auth = require('../middleware/auth');

// Iniciar sesión
// api/reset
router.post('/', 
    resetController.resetearPass
);

// Obtiene el usuario autenticado
router.get('/:token',
    // auth,
    resetController.verificarToken
);

router.post('/:token',
    resetController.actualizarPassword)
module.exports = router;