const Anuncio = require("../models/Anuncio");
const { validationResult } = require("express-validator");
var fs = require('fs');

process.env.CLOUDINARY_URL;

exports.crearAnuncio = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    // Crear un nuevo anuncio
    const anuncio = new Anuncio(req.body);
    const arrayTags = req.body.tags.split(",");

    anuncio.tags = arrayTags;

    // Guardar el creador via JWT
    anuncio.creador = req.usuario.id;
    if (req.body.image !== "") {
      const path = req.file.path;
      const image = req.file.filename;
      anuncio.foto = image;
      anuncio.fotopath = path;
    } else {
      anuncio.foto = "";
    }

    // guardamos el anuncio
    anuncio.save();
    res.json(anuncio);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Obtiene todos los anuncios del usuario actual
exports.obtenerAnuncios = async (req, res) => {
  try {
    const anuncios = await Anuncio.find({ creador: req.usuario.id }).sort({
      creado: -1
    });
    res.json({ anuncios });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// Actualiza un anuncio
exports.actualizarAnuncio = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // extraer la información del anuncio
  const { nombre, descripcion, precio, venta, foto, tags } = req.body;
  const nuevoAnuncio = {};

  if (nombre) {
    nuevoAnuncio.nombre = nombre;
    nuevoAnuncio.descripcion = descripcion;
    nuevoAnuncio.precio = precio;
    nuevoAnuncio.venta = venta;
    nuevoAnuncio.foto = foto;
    nuevoAnuncio.tags = tags;
  }

  try {
    // revisar el ID
    let anuncio = await Anuncio.findById(req.params.id);

    // si el anuncio existe o no
    if (!anuncio) {
      return res.status(404).json({ msg: "Anuncio no encontrado" });
    }

    // verificar el creador del anuncio
    if (anuncio.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    // actualizar
    anuncio = await Anuncio.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoAnuncio },
      { new: true }
    );

    res.json({ anuncio });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};

// Elimina un anuncio por su id
exports.eliminarAnuncio = async (req, res) => {
  try {
    // revisar el ID
    let anuncio = await Anuncio.findById(req.params.id);

    // si el anuncio existe o no
    if (!anuncio) {
      return res.status(404).json({ msg: "Anuncio no encontrado" });
    }

    // verificar el creador del anuncio
    if (anuncio.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }
    
    if(anuncio.foto !== ''){
      fs.unlink(anuncio.fotopath, function(err) {
        if (err) throw err;
      
        console.log('file deleted');
      });
    }

    // Eliminar el Anuncio
    await Anuncio.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Anuncio eliminado " });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
