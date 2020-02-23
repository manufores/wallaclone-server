const express = require('express');
const router = express.Router();
const anuncioController = require('../controllers/anuncioController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const path = require('path');
const multer = require('multer');


const storage=multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    dest: path.join(__dirname, '../public/uploads'),
    fileFilter:((req, file, cb)=>{
        const filetypes= /jpeg|jpg|png|gif/;
        const mimetype =  filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname){
            return cb(null, true);
        }
        cb('Error: Archivo debe ser una imagen válida');
    }),
}).single('image');


// Crea anuncios
// api/anuncios
router.post('/', 
    auth,
    upload,
    [
        check('nombre', 'El nombre del anuncio es obligatoio').not().isEmpty()
    ],
    anuncioController.crearAnuncio
);


// Obtener todos los anuncios
router.get('/', 
    auth,
    anuncioController.obtenerAnuncios
)

// Actualizar anuncio via ID
router.put('/:id', 
    auth,
    [
        check('nombre', 'El nombre del anuncio es obligatoio').not().isEmpty()
    ],
    anuncioController.actualizarAnuncio
);

// Eliminar un anuncio
router.delete('/:id', 
    auth,
    anuncioController.eliminarAnuncio
);

module.exports = router;