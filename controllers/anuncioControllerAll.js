const Anuncio = require('../models/Anuncio');

// Obtiene todos los anuncio de todos los usuarios
exports.obtenerAnuncios = async (req, res) => {
    try {
        const nombre = req.query.nombre;
        const precio = req.query.precio;
        const tags = req.query.tags;
        // const venta = req.query.venta;

        const start = parseInt(req.query.start) || 0;
        const limit = parseInt(req.query.limit) || 20;
        const fields = req.query.fields;
        const sort = req.query.sort;

        const filter = {};

        if (nombre) {
            filter.nombre = new RegExp('^' + req.query.nombre.toLowerCase() + '.*', 'i');
        }

        if (precio) {

            let rango = req.query.precio.split('-');

            if (rango.length === 1) {
                filter.precio = rango[0];
            }
            else if (rango.length === 2) {
                if (!rango[0]) {
                    filter.precio = { $lt: rango[1] };
                }
                else if (!rango[1]) {
                    filter.precio = { $gt: rango[0] };
                }
                else {
                    filter.precio = { $gte: rango[0], $lte: rango[1] };
                }
            }
        }


        if (tags) {
            
            if (tags.includes(tags) === true) {
                filter.tags = tags;
            }
        }

        if (typeof venta !== 'undefined') {

            filter.venta = venta;

        }

        const anuncios = await Anuncio.list({ filter: filter, start, limit, fields, sort });

        res.json({ anuncios });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
