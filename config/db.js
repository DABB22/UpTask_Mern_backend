
import mongoose from "mongoose";

const conectarDB = async () => {

    try {
        // 
        const connection = await mongoose.connect(
            process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        ) // .connect() metodo de mongoose que nos permite conectarnos a un servidor.

        // variable para ver en la consola donde se está conectado.
        const url = `${connection.connection.host}: ${connection.connection.port}`
        console.log(`MongoDB Conectado en: ${url}`)
        
    } catch (error) {
        console.log(`error: ${error.message}`)
        process.exit(1) //usualmente node termina los procesos con cero al colocarle un uno(1) y el process.exit(), el process.exit va a forzar que el proceso termine y no importa si hay otros procesos ejecutandose como la DB es importante para este proyecto va a terminar con esos procesos de forma sincrona o sea que van hacer de forma inmediata por lo que NO va a esperar a que terminen los procesos para poder terminarlos en caso de que la base de datos no se pueda conectar.
    }
}

export default conectarDB;