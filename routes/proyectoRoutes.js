
import express from 'express';
import { 
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
} from '../controllers/proyectoController.js'
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

// router.get('/', checkAuth, obtenerProyectos)
// router.post('/', checkAuth, nuevoProyecto)
router
    .route('/')
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto);

router
    .route('/:id')
    .get(checkAuth, obtenerProyecto)
    .put(checkAuth, editarProyecto)
    .delete(checkAuth, eliminarProyecto)

router
    .route('/colaboradores')
    .post(checkAuth, buscarColaborador)

router
    .route('/colaboradores/:id')
    .post(checkAuth, agregarColaborador)

router
    .route('/eliminar-colaborador/:id')
    .post(checkAuth, eliminarColaborador)



export default router;

