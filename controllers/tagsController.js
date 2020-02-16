const Tags = require('../models/Tags');

exports.obtenerTags = async (req, res) => {
    try {
        const tags =  await Tags.find();
        res.json({ tags });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');        
    }
}