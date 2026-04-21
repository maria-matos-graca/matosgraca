// models/index.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import initBlogPostModel from './blogpost.model.js';
import initGalleryModel from './gallery.model.js';

dotenv.config();

let sequelize;

if (process.env.NODE_ENV === 'production' || process.env.DB_DIALECT === 'postgres') {
    console.log('Ligando ao PostgreSQL (produção)...');
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
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        }
    );
} else {
    console.log('Ligando ao SQLite (desenvolvimento)...');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    });
}

const BlogPost = initBlogPostModel(sequelize);
const GalleryImage = initGalleryModel(sequelize);
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
        validate: {
            isEmail: true
        }
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
    },
    scopes: {
        withPassword: {
            attributes: { include: ['password_hash'] }
        }
    }
});

BlogPost.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
User.hasMany(BlogPost, { foreignKey: 'author_id', as: 'posts' });
const db = {
    sequelize,
    Sequelize,
    User,
    BlogPost,
    GalleryImage
};

const syncDatabase = async () => {
    if (process.env.NODE_ENV !== 'production') {
        await sequelize.sync({ alter: true });
        console.log('Database synced');
        //criar admin se não existir
        const adminCount = await User.count();
        if (adminCount === 0) {
            const bcrypt = await import('bcryptjs');
            await User.create({
                username: 'admin',
                email: 'admin@blog.com',
                password_hash: await bcrypt.hash('admin123', 10),
                role: 'admin'
            });
            console.log('Admin created');
        }
    }
};

if (process.env.NODE_ENV !== 'production') {
    syncDatabase().catch(console.error);
}

export default db;