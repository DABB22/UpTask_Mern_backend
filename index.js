
// esto busca el paquete de express y lo asigna a esta variable.
// const express = require("express")
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'

//conectar con express
const app = express()
app.use(express.json()) // esto habilita la lectura de tipo JSON, que la pueda procesar correctamente
//configurar variables de entorno
dotenv.config()
//conectar con la BD
conectarDB()


//*CONFIGURACIÓN DE CORS
//configuramos una white list
const whitelist = [process.env.FRONTEND_URL];
//configurar cors - este codigo viene de la documentación de cors
const corsOptions = {
    origin: function(origin, callback) { //origin es basicamente el origen del request(quien está haciendo el request)
        //la funcion toma dos parametros, el origin y un callback nos va a permitir el acceso y en caso de que no haya callback bloqueará el acceso
        if(whitelist.includes(origin)){
        //si el origin está en whitelist quiere decir que puede consultar la API
            callback(null, true) // callback con null porque no hay mensaje de error, y true para dar el acceso
        }else{
        //No tiene permitido el acceso a consultar la API
            callback(new Error('Error de Cors')) // callback con un mensaje de error
        }
    }
} 

app.use(cors(corsOptions))


//Routing
app.use('/api/usuarios', usuarioRoutes) 
app.use('/api/proyectos', proyectoRoutes) 
app.use('/api/tareas', tareaRoutes) 
//configuramos la variable de entorno para el puerto para que quede configurada para el deployment y en caso de que estemos en desarrollo nos asigna el puerto 4000
const PORT = process.env.PORT || 4000


//abrir conexión de exprees con app
const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})


//* Socket.io
import { Server } from 'socket.io'

const io = new Server(servidor, {
    pingTimeout: 60000, // 60000 es un valor que se usa por defecto 
    cors: {
        origin: process.env.FRONTEND_URL 
    }
})

//abrir conexición de socket.io
io.on('connection', (socket) => {
    // console.log('Conectado a socket.io')

    //Definir los eventos de socket.io
    socket.on('abrir proyecto', (proyectoId)=> {
        socket.join(proyectoId)

    })

    socket.on('nueva tarea', tarea => {
        socket.to(tarea.proyecto).emit('tarea agregada', tarea)
    })

    socket.on('editar tarea', tarea => {
        socket.to(tarea.proyecto._id).emit('tarea editada', tarea)
    })

    socket.on('eliminar tarea', tarea => {
        socket.to(tarea.proyecto).emit('tarea eliminada', tarea)
    })

    socket.on('cambiar estado', tarea => {
        socket.to(tarea.proyecto._id).emit('nuevo estado', tarea)
    })

})