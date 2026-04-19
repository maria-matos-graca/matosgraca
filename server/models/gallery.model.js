// backend/models/gallery.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const GalleryImage = sequelize.define('GalleryImage', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false
        },
        original_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mime_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        size_bytes: {
            type: DataTypes.INTEGER
        },
        width: {
            type: DataTypes.INTEGER
        },
        height: {
            type: DataTypes.INTEGER
        },
        alt_text: {
            type: DataTypes.STRING
        },
        caption: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        // Usar apenas category como string, sem chave estrangeira
        category: {
            type: DataTypes.STRING,
            defaultValue: 'general',
            allowNull: false
        },
        featured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_by: {
            type: DataTypes.INTEGER
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'gallery_images',
        timestamps: false,
        underscored: true
    });
    
    return GalleryImage;
};

/*import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const GalleryImage = sequelize.define('GalleryImage', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        original_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        path: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        mime_type: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        size_bytes: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        width: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        alt_text: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        caption: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING(100),
            defaultValue: 'general'
        },
        featured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_by: {
        type: DataTypes.UUID,  // ← Mudar de STRING para UUID
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
        }
    }, {
        tableName: 'gallery_images',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return GalleryImage;
};*/