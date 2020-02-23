const mongoose = require('mongoose');

const AnuncioSchema = mongoose.Schema({
    nombre: {
        type: String,
        index: true,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        index: true,
        required: false,
        trim: true
    },

    precio : {
        type: Number,
        index: true
    },

    venta: { 
        type: Boolean, 
        index: true },

    foto: {
        type: String,
        required: false,
        trim: true
    },
    fotopath: {
        type: String,
        required: false,
        trim: true
    },

    tags: {
        type: Array,
    },

    creador: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario'
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

AnuncioSchema.statics.list = function ({ filter, start, limit, fields, sort }) { //usamos el destructuring poniendo las llaves y de esa manera conseguimos que no hace falta pasarle los campos por orden desde el controlador
    const query = Anuncio.find(filter);
    query.skip(start);
    query.limit(limit);
    query.select(fields);
    query.sort(sort);


    return query.exec();
}

//creamos el modelo de anuncio
const Anuncio = mongoose.model('Anuncio', AnuncioSchema);

module.exports = Anuncio;