const express = require('express');
const router = express.Router();
const anuncioControllerAll = require('../controllers/anuncioControllerAll');


// Obtener todos los anuncios
router.get('/', 
    
anuncioControllerAll.obtenerAnuncios
)



module.exports = router;