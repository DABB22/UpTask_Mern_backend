
import express from 'express';
import { 
    registar, 
    autenticar, 
    confirmar, 
    olvidePassword, 
    comprobarToken,
    nuevoPassword,
    perfil,
    // listar
} from '../controllers/usuarioController.js'
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

//Autenticación, Registro y Confirmación de Usuarios
// router.get('/', listar) // crea un nuevo usuario
router.post('/', registar) // crea un nuevo usuario
router.post('/login', autenticar) // inicio de sesión / autenticación de usuarios
// /:token es como se maneja el routing dinamico en express
router.get('/confirmar/:token', confirmar) // confirmar la cuenta
router.post('/olvide-password', olvidePassword) // solicitar cambio de contraseña
// router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)// forma más compacta
router.get('/olvide-password/:token', comprobarToken) // comprueba token para actualizar password
router.post('/olvide-password/:token', nuevoPassword) // actualizar password


router.get('/perfil', checkAuth, perfil) // 


export default router;