const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

exports.resetearPass = async (req, res) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() })
    }

    // extraer el email y password
    const { email } = req.body;

    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if(!usuario) {
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        // Creamos toke con crypto

        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expiracion =  Date.now() + 3600000;

        // guardamos en la BBDD
        await usuario.save();

        // url de reset
        const resetUrl = `http://${req.headers.host}/api/reset/${usuario.token}`;
        // `http://localhost:4000/api/reset/${usuario.token}`

        // Enviar el correo con el Token
        await enviarEmail.enviar({
            usuario,
            subject: 'Password Reset',
            resetUrl,
            archivo: 'restablecer-password'
        });


        res.status(200).json({msg: 'Se ha enviado un mail para restablecer el password'});


    } catch (error) {
        console.log(error);
    }
}

exports.verificarToken = async (req, res) => {
    const token = req.params.token;
    const usuario = await Usuario.findOne({ token })

    if(!usuario) {
        return res.status(400).json({msg: 'Acción no válida'});
    }
    res.redirect(`http://${process.env.FRONT_URL}/newpassword/${token}`);
    // `http://localhost:3000/newpassword/${token}`
}

// Verifica el token válido pero también la de fecha de expiración
exports.actualizarPassword = async (req, res) => {
    const { token } = req.body;
    // const token = req.params.token;
    const usuario = await Usuario.findOne({ token, expiracion:{$gte: Date.now()} });

    // console.log(usuario);

    // verificamos si el usuario existe
    if(!usuario){
        res.redirect(`http://${process.env.FRONT_URL}/reset-pass`);
        // `http://localhost:3000/reset-pass`
    }

    // Hashear el password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(req.body.password, salt );
    
    // Limpiamos el token y la fecha de expiracion de la BBDD
    usuario.token=null;
    usuario.expiracion=null;

    await usuario.save();
    
    res.status(200).json('ok');
}


// Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}