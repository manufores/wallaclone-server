const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
var path = require('path');

// crear el servidor
const app = express();

// Habilitar pug
app.set('view engine', 'pug');

// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Conectar a la base de datos
conectarDB();

// habilitar cors
app.use(cors());

// Habilitar express.json
app.use( express.json({ extended: true }));

// puerto de la app
const port = process.env.PORT || 4000;

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reset', require('./routes/reset'));
app.use('/api/newpassword', require('./routes/newpassword'));
app.use('/api/anuncios', require('./routes/anuncios'));
app.use('/api/anunciosall', require('./routes/anunciosall'));
app.use('/api/tags', require('./routes/tags'));
app.use('/images/uploads', express.static(path.join(__dirname, 'public/uploads')));

// arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});

require('./handlers/email');