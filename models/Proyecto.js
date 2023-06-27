
import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    descripcion: {
        type: String,
        trim: true,
        required: true
    },
    fechaEntrega: {
        type: Date,
        default: Date.now(),

    },
    cliente: {
        type: String,
        trim: true,
        required: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    },
    tareas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tarea"
        }
    ],
    colaboradores: [ // se usa corchetes(array) porque pueden haber multiples colaboradores
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        }
    ]
}, {
    timestamps: true // esto nos creará 2 columnas más una de creado y otra de actualizado 
})

//AQUI EN EL MODELO TAMBIEN PODEMOS CREAR NUESTRAS PROPIAS FUNCIONES


// Definimos el MODELO
const Proyecto = mongoose.model("Proyecto", proyectosSchema)

// lo hacemos disponible para exportar.
export default Proyecto;

