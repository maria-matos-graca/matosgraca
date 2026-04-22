// models/gallery.model.js
import { DataTypes } from 'sequelize';

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
    }
  }, {
    tableName: 'gallery_images',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return GalleryImage;
};