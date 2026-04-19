import express from 'express';
import crypto from 'crypto';
import authenticateJWT from '../middleware/auth.js';
import * as blogPosts from "../controllers/blog.controller.js";
import e from 'express';

const router = express.Router();
 
    router.post("/", blogPosts.create);
    router.get("/", blogPosts.findAll);
    router.get("/:id", blogPosts.findOne);
    router.put("/:id", blogPosts.update);
    router.delete("/:id", blogPosts.deleteOne);
    router.delete("/", blogPosts.deleteAll);
    router.get("/published", blogPosts.findAllPublished);

    export default router;




/*
// CREATE post (protegido)
router.post('/', authenticateJWT, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Título e conteúdo são obrigatórios" });
  }
  
  const newPost = {
    id: crypto.randomUUID(),
    title,
    content,
    date: new Date().toISOString(),
    author: req.user.username // do middleware JWT
  };
  
  blogPosts.unshift(newPost);
  res.status(201).json(newPost);
});




// GET todos os posts (público)
router.get('/', (req, res) => {
  res.json(blogPosts);
});

// GET post por ID (público)
router.get('/:id', (req, res) => {
  const post = blogPosts.find(b => b.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post não encontrado" });
  res.json(post);
});



// UPDATE post (protegido)
router.put('/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  
  const index = blogPosts.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Post não encontrado" });
  }
  
  // Verificar se o usuário é o autor (opcional, mas recomendado)
  // if (blogPosts[index].author !== req.user.username) {
  //   return res.status(403).json({ error: "Não autorizado" });
  // }
  
  blogPosts[index] = {
    ...blogPosts[index],
    title: title || blogPosts[index].title,
    content: content || blogPosts[index].content,
    updated: new Date().toISOString()
  };
  
  res.json(blogPosts[index]);
});

// DELETE post (protegido)
router.delete('/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  
  const index = blogPosts.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Post não encontrado" });
  }
  
  const deletedPost = blogPosts.splice(index, 1)[0];
  res.json({ 
    success: true, 
    message: "Post deletado com sucesso",
    post: deletedPost 
  });
});

export default router; */