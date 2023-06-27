
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const checkAuth = async (req, res, next) => {

    let token
    // si hay una autorización y esta inicia con un Bearer signfica que si estamos enviando un token en ese header y vamos a ejecutar este código
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        try {
            token = req.headers.authorization.split(' ')[1]
            const decode = jwt.verify(token, process.env.JWT_SECRET) // con .verify podemos verificar el token(JWT) el primer parametro que toma es el token, el segundo es la llave privada (la misma que se uso para firmar el token) y el tercero 

            req.usuario = await Usuario.findById(decode.id).select('-password -confirmado -token -createdAt -updatedAt -__v')
            return next()
        } catch (error) {
            return res.status(404).json({msg: 'Hubo un error'})
        }
    }

    if(!token){
        const error = new Error('Token NO válido')
        return res.status(404).json({msg: error.message})
    }

   next()
}

export default checkAuth