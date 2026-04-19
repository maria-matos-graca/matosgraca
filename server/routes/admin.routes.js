import express from 'express';
import authenticateJWT from '../middleware/auth.js';

const router = express.Router();

router.post('/posts', authenticateJWT, (req, res) => {

  console.log('Utilizador autenticado:', req.user);
  

  res.json({ 
    success: true, 
    message: 'Publicação criada com sucesso',
    data: req.body // dados da publicação
  });
});


router.delete('/posts/:id', authenticateJWT, (req, res) => {
  const postId = req.params.id;
  res.json({ 
    success: true, 
    message: `Publicação ${postId} eliminada` 
  });
});

// rota de actualizar
router.put('/posts/:id', authenticateJWT, (req, res) => {
  const postId = req.params.id;
  res.json({ 
    success: true, 
    message: `Publicação ${postId} atualizado` 
  });
});

export default router;