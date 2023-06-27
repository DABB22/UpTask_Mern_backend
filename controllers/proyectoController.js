
import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"
import Usuario from "../models/Usuario.js"

const obtenerProyectos = async (req, res) => {
    // const proyectos = await Proyecto.findById(req.usuario._id)
    const proyectos = await Proyecto.find({ //por default maneja $and
        '$or': [
            { colaboradores: { $in: req.usuario}},
            { creador : { $in: req.usuario}}
        ]
    })
        .select('-tareas')
    res.json(proyectos)
}

const nuevoProyecto = async (req, res) => {
    
    const proyecto = new Proyecto(req.body)//instanciamos el modelo de proyecto con la información de req.body
    proyecto.creador = req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save()
        // console.log(proyectoAlmacenado)
        res.json(proyectoAlmacenado)
        // console.log(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }

}

const obtenerProyecto = async (req, res) => {
    const {id} = req.params
    let proyecto

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        proyecto = await Proyecto.findById(id)
            .populate( {path: 'tareas', populate: {path: 'completado', select: 'nombre'}})
            .populate('colaboradores', 'nombre email')

        if(!proyecto){
            const error = new Error('No encontrado')
            return res.status(404).json({msg: error.message})
        }
    
        if(proyecto.creador.toString() !== req.usuario.id.toString() && !proyecto.colaboradores.some( colaborador => colaborador._id.toString() === req.usuario._id.toString())){
            const error = new Error('Acción no válida')
            return res.status(401).json({msg: error.message})
        }

        res.json(
            proyecto
        )
    }else {
        const error = new Error("Error - Acción no válida")
        return res.status(404).json({ msg: error.message})
    }
   

}

const editarProyecto = async (req, res) => {
    const {id} = req.params
    const proyecto = await Proyecto.findById(id)

    if(!proyecto){
        const error = new Error('No encontrado')
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario.id.toString() ){
        const error = new Error('Acción no válida')
        return res.status(401).json({msg: error.message})
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente
    
    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }

}

const eliminarProyecto = async (req, res) => {
    const {id} = req.params
    const proyecto = await Proyecto.findById(id)

    if(!proyecto){
        const error = new Error('No encontrado')
        return res.status(404).json({msg: error.message})
    }

    if(proyecto.creador.toString() !== req.usuario.id.toString() ){
        const error = new Error('Acción no válida')
        return res.status(401).json({msg: error.message})
    }

    try {
        await proyecto.deleteOne()
        res.json({msg: "Proyecto Eliminado correctamente"})
    } catch (error) {
        console.log(error)
    }

}

const buscarColaborador = async (req, res) => {

    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v ')

    if(!usuario){
        const error = new Error ("Usuario no encontrado")
        return res.status(404).json({ msg: error.message})
    }

    res.json(usuario)

}

const agregarColaborador = async (req, res) => {

    const { id } = req.params

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        const proyecto = await Proyecto.findById(req.params.id)

        if(!proyecto){
            const error = new Error("Proyecto no encontrado")
            return res.status(404).json({ msg: error.message })
        }

        if(proyecto.creador.toString() !== req.usuario.id.toString() ){
            const error = new Error('Acción no válida')
            return res.status(401).json({msg: error.message})
        }

        const {email} = req.body
        const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v ')
    
        if(!usuario){
            const error = new Error ("Usuario no encontrado")
            return res.status(404).json({ msg: error.message})
        }

        // El colaborador no es el admin del proyecto
        if( proyecto.creador.toString() === usuario._id.toString() ){
            const error = new Error ("El creador del proyecto no puede ser colaborador")
            return res.status(404).json({ msg: error.message})
        }

        //Revisar que el colaborador no este ya agregado al proyecto
        if(proyecto.colaboradores.includes(usuario._id)){
            const error = new Error ("La persona que intentas asignar ya fue agregada")
            return res.status(404).json({ msg: error.message})
        }

        // luego de estas validaciones procedemos agregar el colaborador
        proyecto.colaboradores.push(usuario._id)
        await proyecto.save()
        res.json({msg: 'Colaborador agregado correctamente'})

    }else{
        const error = new Error("Error - Acción no válida")
        return res.status(404).json({ msg: error.message})
    }

}

const eliminarColaborador = async (req, res) => {

    const { id } = req.params

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        const proyecto = await Proyecto.findById(req.params.id)

        if(!proyecto){
            const error = new Error("Proyecto no encontrado")
            return res.status(404).json({ msg: error.message })
        }

        if(proyecto.creador.toString() !== req.usuario.id.toString() ){
            const error = new Error('Acción no válida')
            return res.status(401).json({msg: error.message})
        }

        // luego de estas validaciones procedemos a eliminar el colaborador
        proyecto.colaboradores.pull(req.body.id)
        await proyecto.save()
        res.json({msg: 'Colaborador eliminado correctamente'})

    }else{
        const error = new Error("Error - Acción no válida")
        return res.status(404).json({ msg: error.message})
    }
}

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
    
}