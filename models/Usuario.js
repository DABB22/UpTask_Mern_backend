
import mongoose from "mongoose"
import bcrypt from 'bcrypt'

//Modelo de usuario, el schema es la estructura de la BD
const usuarioSchema = mongoose.Schema({
    //objeto con toda la definición/campos que va a requerir el modelo de usuario. 
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token: {
        type: String,
    },
    confirmado: {
        type: Boolean,
        default: false,
    },
}, 
    {
        timestamps: true, // esto nos creará 2 columnas más una de creado y otra de actualizado 
    }
)

// HASHEO DE LOS PASSWORD CON BCRYPT
usuarioSchema.pre('save', async function(next){ //este middleware se va a ejecutar antes de almacenar el registro em la BD
    //Con este código evitamos que en caso de alguna modificacion de datos de usuario pero no del password evitar que el password sea nuevamente hasheado ya que si no se evita se cambiaría el password original del usuario
    if (!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt(10)//el parametro es el numero de rondas, 10 es un buen número de hash
    this.password = await bcrypt.hash(this.password, salt)
})


//AQUI EN EL MODELO TAMBIEN PODEMOS CREAR NUESTRAS PROPIAS FUNCIONES
//FUNCIÓN PARA COMPROBAR PASSWORD
usuarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}


// Definimos el MODELO
const Usuario = mongoose.model("Usuario", usuarioSchema)

// lo hacemos disponible para exportar.
export default Usuario;

