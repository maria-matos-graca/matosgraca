// backend/index.js
import express from 'express';
import cors from 'cors';
import loadEnv from './config/env.js';
import { Resend } from 'resend';
import db from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import blogRoutes from './routes/blog.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Carregar variáveis de ambiente ANTES de tudo
loadEnv();

const resend = new Resend(process.env.EMAIL_API_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Disponibilizar db nas rotas
app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/gallery/images', express.static(path.join(__dirname, 'public/gallery/images')));
app.use('/gallery/thumbnails', express.static(path.join(__dirname, 'public/gallery/thumbnails')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [process.env.EMAIL_TO || 'maria.matos.graca@gmail.com'],
      reply_to: email,
      subject: `Contato do Blog: ${name}`,
      html: `<p><strong>Nome:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mensagem:</strong></p>
             <p>${message}</p>`,
    });
    
    if (error) throw error;
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro Resend:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});




app.get('/api/health', async (req, res) => {
    try {
        await db.sequelize.authenticate();
        res.json({
            status: 'OK',
            database: process.env.DB_DIALECT === 'postgres' ? 'PostgreSQL' : 'SQLite',
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(503).json({
            status: 'ERROR',
            database: 'disconnected',
            error: error.message
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
(async () => {
    try {
        await db.sequelize.authenticate();
        console.log(`${process.env.DB_DIALECT === 'postgres' ? 'PostgreSQL' : 'SQLite'} conectado!`);
        
        await db.sequelize.sync({ alter: true });
        console.log('Tabelas sincronizadas');
        
        const bcrypt = await import('bcryptjs');
        
        if (process.env.ADMIN_PASSWORD) {
            const adminExists = await db.User.findOne({
                where: { username: process.env.ADMIN_USER || 'admin' }
            });
            
            if (!adminExists) {
                await db.User.create({
                    username: process.env.ADMIN_USER || 'admin',
                    email: process.env.ADMIN_EMAIL || 'admin@blog.com',
                    password_hash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
                    role: 'admin'
                });
                console.log('Admin criado');
            } else {
                console.log('Admin já existe');
            }
        } else {
            console.log('ADMIN_PASSWORD não definida - admin não foi criado');
        }
        
        app.listen(PORT, () => {
            console.log(`Servidor iniciado na porta: ${PORT} com base de dados: ${process.env.DB_DIALECT}`);
        });
        
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
})();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n A desligar servidor...');
    await db.sequelize.close();
    console.log('Conexões fechadas');
    process.exit(0);
});