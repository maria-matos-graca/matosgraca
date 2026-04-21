// routes/auth.routes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Tentativa de login:', { username });
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username e senha são obrigatórios' });
    }
    
    // Buscar utilizador
    const user = await req.db.User.findOne({
      where: { username },
      attributes: ['id', 'username', 'email', 'role', 'password_hash']
    });
    
    if (!user) {
      console.log('Utilizador não encontrado:', username);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    console.log('Utilizador encontrado:', user.username);
    
    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      console.log('Senha inválida para:', username);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    console.log('Senha válida para:', username);
    
    // Gerar token
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(400).json({ valid: false, error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.json({ valid: false, error: error.message });
  }
});

export default router;