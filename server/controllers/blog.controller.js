import db from "../models/index.js";

const Op = db.Sequelize.Op;
const BlogPost = db.BlogPost;
export const create = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).send({
                message: "Content can not be empty!",
            });
        }
        const blogData = {
            title: req.body.title,
            content: req.body.content,
            excerpt: req.body.excerpt || null,
            published: req.body.published !== undefined ? req.body.published : true,
            authorId: req.user?.id || 'admin-id', // isto ainda será mesmo necessário?
            tags: req.body.tags || []
        };

        // Save blog in the database
        const data = await BlogPost.create(blogData);
        res.status(201).send(data);
        
    } catch (err) {
        console.error('Erro ao criar post:', err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the blog.",
        });
    }
};

export const findAll = async (req, res) => {
    try {
        // Allow a filter condition via query parameter
        const title = req.query.title;
        const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
        
        const data = await BlogPost.findAll({ 
            where: condition,
            order: [['created_at', 'DESC']],
            include: [{
                model: db.User,
                as: 'author',
                attributes: ['id', 'username']
            }]
        });
        
        res.send(data);
    } catch (err) {
        console.error('Erro ao buscar posts:', err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving blogPosts.",
        });
    }
};

export const findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await BlogPost.findByPk(id, {
            include: [{
                model: db.User,
                as: 'author',
                attributes: ['id', 'username']
            }]
        });
        
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find blog with id=${id}.`,
            });
        }
    } catch (err) {
        console.error('Erro ao buscar post:', err);
        res.status(500).send({
            message: "Error retrieving blog with id=" + req.params.id,
        });
    }
};

export const update = async (req, res) => {
    try {
        const id = req.params.id;
        
        const [num] = await BlogPost.update(req.body, {
            where: { id: id },
        });
        
        if (num === 1) {
            res.send({
                message: "Blog was updated successfully.",
            });
        } else {
            res.status(404).send({
                message: `Cannot update blog with id=${id}. Maybe blog was not found or req.body is empty!`,
            });
        }
    } catch (err) {
        console.error('Erro ao atualizar post:', err);
        res.status(500).send({
            message: "Error updating blog with id=" + req.params.id,
        });
    }
};

export const deleteOne = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await BlogPost.destroy({
            where: { id: id },
        });
        
        if (num === 1) {
            res.send({
                message: "Blog was deleted successfully!",
            });
        } else {
            res.status(404).send({
                message: `Cannot delete blog with id=${id}. Maybe blog was not found!`,
            });
        }
    } catch (err) {
        console.error('Erro ao eliminar publicação:', err);
        res.status(500).send({
            message: "Could not delete blog with id=" + req.params.id,
        });
    }
};

// Delete all blogPosts
export const deleteAll = async (req, res) => {
    try {
        // Delete all blogPosts
        const nums = await BlogPost.destroy({
            where: {},
            truncate: false,
        });
        
        res.send({ message: `${nums} blogPosts were deleted successfully!` });
    } catch (err) {
        console.error('Erro ao eliminar todos:', err);
        res.status(500).send({
            message: err.message || "Some error occurred while removing all blogPosts.",
        });
    }
};

// Find all published blogPosts
export const findAllPublished = async (req, res) => {
    try {
        // Find all blogPosts with published = true
        const data = await BlogPost.findAll({ 
            where: { published: true },
            order: [['created_at', 'DESC']]
        });
        
        res.send(data);
    } catch (err) {
        console.error('Erro ao buscar publicados:', err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving blogPosts.",
        });
    }
};