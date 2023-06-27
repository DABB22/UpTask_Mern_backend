
import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarId.js'
import generarJWT from '../helpers/generarJWT.js'
import { emailRegistro, emailResetPassword } from '../helpers/email.js'

const registar = async (req, res) => {

    //EVITAR REGISTROS DUPLICADOS
    const {email} = req.body
    const existeUsuario = await Usuario.findOne({ email })
    if (existeUsuario) {
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({ msg: error.message})
    }

    //REGISTRO DEL NUEVO USUARIO
    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        await usuario.save()
        const datosEmail = { // objeto a pasar como argumento a la función emailRegistro() que envía correo de registro
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        }
        emailRegistro(datosEmail) // función para el envío del correo.
        res.json({msg: 'Usuario creado correctamente, revisa tu email para confirmar tu cuenta'})
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body

    //COMPROBAR SI USUARIO EXISTE
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error('Usuario no existe')
        return res.status(404).json({ msg: error.message})
    }

    //COMPROBAR SI USUARIO ESTÁ CONFIRMADO
    if(!usuario.confirmado){
        const error = new Error('Cuenta aún sin confirmar')
        return res.status(403).json({ msg: error.message})
    }
    
    //COMPROBAR SU PASSWORD
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error('Contraseña incorrecta')
        return res.status(404).json({ msg: error.message})
    }
    
}

const confirmar = async (req, res) => {
    const {token} = req.params
    const usuarioConfirmar = await Usuario.findOne({ token })
    if(!usuarioConfirmar){
        const error = new Error('Error - Token NO válido')
        return res.status(403).json({ msg: error.message})
    }

    try {
        usuarioConfirmar.confirmado=true
        usuarioConfirmar.token = ''
        await usuarioConfirmar.save()
        res.status(200).json({ msg: 'Usuario confirmado correctamente'})
    } catch (error) {
        console.log(error)
    }
}

const olvidePassword = async (req, res) => {
    const {email} = req.body
    const usuario = await Usuario.findOne({ email })
    if(!usuario){
        const error = new Error('Usuario no existe')
        return res.status(404).json({ msg: error.message})
    }
    
    try {
        usuario.token = generarId()
        await usuario.save()
        const datosEmail = { // objeto a pasar como argumento a la función emailRegistro() que envía correo de registro
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        }
        emailResetPassword(datosEmail) // función para el envío del correo.
        res.status(200).json({ msg: 'Hemos enviado las indicaciones a tu correo'})
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params
    const usuario = await Usuario.findOne({ token })
    if(!usuario){
        const error = new Error('Token NO válido')
        return res.status(404).json({ msg: error.message})
        
    }
    else{
        res.status(200).json({ msg: 'Token válido'})
    }
    
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params
    const {password} = req.body
    const usuario = await Usuario.findOne({ token })
    if(usuario){
        try {
            usuario.password = password
            usuario.token = ''
            await usuario.save()
            res.status(200).json({ msg: 'Contraseña actualizada correctamente'})
        } catch (error) {
            console.log(error)
        }
    }

}

const perfil = async (req, res) => {
    const {usuario} = req
    res.json(usuario)
}

// const listar = async (req, res) => {
//     const usuarios = await Usuario.find()
//     res.json(usuarios)
// }

export {
    registar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    // listar

} 