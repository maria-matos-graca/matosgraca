// backend/index.js
import express from 'express';
import cors from 'cors';
import loadEnv from './config/env.js';

// Carregar variáveis de ambiente ANTES de tudo
loadEnv();

import db from './models/index.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import blogRoutes from './routes/blog.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

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



// Health check
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
        console.log(`✅ ${process.env.DB_DIALECT === 'postgres' ? 'PostgreSQL' : 'SQLite'} conectado!`);
        
        app.listen(PORT, () => {
            console.log('==========================================');
            console.log('🚀 Servidor iniciado com sucesso!');
            console.log(`📍 Porta: ${PORT}`);
            console.log(`💾 Banco: ${process.env.DB_DIALECT === 'postgres' ? 'PostgreSQL' : 'SQLite'}`);
            console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 URL: http://localhost:${PORT}`);
            console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
            console.log('==========================================');
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
})();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 A desligar servidor...');
    await db.sequelize.close();
    console.log('✅ Conexões fechadas');
    process.exit(0);
});