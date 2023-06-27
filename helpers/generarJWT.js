
import jwt from 'jsonwebtoken'

const generarJWT = (id) => {

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // esta opcion indica cuanto tiempo va estar vigente el JWT
    } ) // este .sign() es un método que nos permite crear un JWT, el primer parámetro es un objeto (es lo que se va a colocar en el JWT), el segundo parámetro es lo que se conoce como la llave privada (esta normalmente se tiene que almacenar en las variables de entorno) la cual sirve para firmar y comprobar el JWT y el tercer parámetro es un objeto con opciones 
}

export default generarJWT

// https://jwt.io/