// backend/models/index.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar .env baseado no ambiente
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config();
}

import initBlogPostModel from './blogpost.model.js';
import initGalleryModel from './gallery.model.js';

// Configuração do Sequelize baseada no ambiente
let sequelize;

if (process.env.DB_DIALECT === 'postgres') {
    // Configuração para PostgreSQL (produção)
    console.log('🐘 Conectando ao PostgreSQL...');
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            dialect: 'postgres',
            logging: false,
            dialectOptions: {
                ssl: process.env.NODE_ENV === 'production' ? {
                    require: true,
                    rejectUnauthorized: false
                } : false
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );
} else {
    // Configuração para SQLite (desenvolvimento)
    console.log('📁 Conectando ao SQLite...');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DB_STORAGE || './database.sqlite',
        logging: false,
        pool: {
            max: 1,
            min: 0,
            idle: 10000
        }
    });
}

// Inicializar modelos (sem Category)
const GalleryImage = initGalleryModel(sequelize);
const BlogPost = initBlogPostModel(sequelize);

// Model User
const User = sequelize.define('User', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
        validate: { isEmail: true }
    },
    password_hash: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.ENUM('admin', 'author', 'user'),
        defaultValue: 'user'
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    defaultScope: {
        attributes: { exclude: ['password_hash'] }
    }
});

// ============================================
// ASSOCIAÇÕES
// ============================================

// Blog associations
BlogPost.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
User.hasMany(BlogPost, { foreignKey: 'author_id', as: 'posts' });

// ============================================
// SINCRONIZAR TABELAS (APENAS EM DESENVOLVIMENTO)
// ============================================
const syncDatabase = async () => {
    try {
        if (process.env.NODE_ENV !== 'production') {
            // Em desenvolvimento, sincroniza as tabelas
            await sequelize.sync({ alter: true });
            console.log('✅ Tabelas sincronizadas');
            
            // Criar admin padrão se não existir
            const userCount = await User.count();
            if (userCount === 0) {
                const bcrypt = await import('bcryptjs');
                await User.create({
                    username: process.env.ADMIN_USER || 'admin',
                    email: process.env.ADMIN_EMAIL || 'admin@blog.com',
                    password_hash: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10),
                    role: 'admin'
                });
                console.log('✅ Admin padrão criado (admin/admin123)');
            }
        } else {
            // Em produção, apenas verifica a conexão
            await sequelize.authenticate();
            console.log('✅ Conexão PostgreSQL verificada');
        }
    } catch (error) {
        console.error('Erro na sincronização:', error);
        throw error;
    }
};

// Executar sincronização
syncDatabase();

// ============================================
// OBJETO DB PARA EXPORTAR
// ============================================
const db = {
    sequelize,
    Sequelize,
    User,
    BlogPost,
    GalleryImage
};

export default db;