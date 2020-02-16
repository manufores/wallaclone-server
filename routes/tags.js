// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tagsController = require('../controllers/tagsController');

// Consulta de Tags
router.get('/', 
    // auth,
    tagsController.obtenerTags    
);


module.exports = router;