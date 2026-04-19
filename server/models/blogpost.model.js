import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const BlogPost = sequelize.define("BlogPost", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'blog_posts',
        timestamps: true, 
        underscored: true 
    });

    return BlogPost;
};