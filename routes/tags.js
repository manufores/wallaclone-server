// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const tagsController = require('../controllers/tagsController');

// Consulta de Tags
router.get('/', 
    tagsController.obtenerTags    
);


module.exports = router;