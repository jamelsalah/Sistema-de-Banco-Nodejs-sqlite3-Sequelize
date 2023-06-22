import express from 'express';
import pessoaController from '../controllers/pessoaController.js';

const router = express.Router();

router.get('/pessoa/cadastrar', pessoaController.cadastrarView);
router.post('/pessoa/cadastrar', pessoaController.cadastrarPessoa);

router.get('/pessoa/listar', pessoaController.listarView);

router.get('/pessoa/editar/:id', pessoaController.editarView);
router.post('/pessoa/editar', pessoaController.editarPessoa);

router.get('/pessoa/deletar/:id', pessoaController.deletarPessoa);

export default router;