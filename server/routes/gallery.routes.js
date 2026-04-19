import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import authenticateJWT from '../middleware/auth.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const year = new Date().getFullYear();
            const month = String(new Date().getMonth() + 1).padStart(2, '0');
            
            const uploadPath = path.join(__dirname, '../public/gallery/images', year.toString(), month);
            
            ensureDir(uploadPath);
            
            console.log('📁 Upload destination:', uploadPath);
            cb(null, uploadPath);
        } catch (error) {
            console.error('Error in destination:', error);
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        try {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            
            req.uploadedFilename = filename;
            
            console.log('📝 Generated filename:', filename);
            cb(null, filename);
        } catch (error) {
            console.error('Error in filename:', error);
            cb(error);
        }
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        console.log('File accepted:', file.originalname);
        return cb(null, true);
    }
    console.log('File rejected:', file.originalname);
    cb(new Error('Apenas imagens são permitidas'));
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// ============================================
// ROTA DE TESTE
// ============================================
router.get('/test', (req, res) => {
    res.json({ message: 'Gallery routes are working!' });
});

// ============================================
// ROTAS DE CATEGORIAS (DEVEM VIR PRIMEIRO)
// ============================================

// GET /api/gallery/categories - Listar todas as categorias únicas
router.get('/categories', async (req, res) => {
    console.log('GET /categories - Fetching categories');
    try {
        // Usando Sequelize para buscar categorias distintas
        const categories = await req.db.GalleryImage.findAll({
            attributes: [[req.db.Sequelize.fn('DISTINCT', req.db.Sequelize.col('category')), 'category']],
            where: {
                category: { [req.db.Sequelize.Op.ne]: null }
            }
        });
        
        const categoryList = categories
            .map(c => c.category)
            .filter(cat => cat && cat.trim() !== '')
            .sort();
        
        // Garantir que 'general' seja a primeira
        const sortedCategories = categoryList.sort((a, b) => {
            if (a === 'general') return -1;
            if (b === 'general') return 1;
            return a.localeCompare(b);
        });
        
        console.log('Categories found:', sortedCategories);
        res.json({ 
            success: true, 
            categories: sortedCategories 
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// POST /api/gallery/categories - Adicionar nova categoria
router.post('/categories', authenticateJWT, async (req, res) => {
    console.log('POST /categories - Body:', req.body);
    try {
        const { name } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                error: 'Category name is required' 
            });
        }
        
        const categoryName = name.trim().toLowerCase();
        console.log('Adding category:', categoryName);
        
        // Verificar se a categoria já existe
        const existingCategory = await req.db.GalleryImage.findOne({
            where: { category: categoryName }
        });
        
        // Se existir pelo menos uma imagem com esta categoria, ela já existe
        // Apenas retornamos sucesso, não precisamos criar uma tabela separada
        
        res.json({ 
            success: true, 
            category: categoryName,
            message: 'Category added successfully' 
        });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// DELETE /api/gallery/categories/:name - Remover categoria
router.delete('/categories/:name', authenticateJWT, async (req, res) => {
    console.log('DELETE /categories/:name - Category:', req.params.name);
    try {
        const { name } = req.params;
        
        if (!name || name === 'general') {
            return res.status(400).json({ 
                success: false, 
                error: 'Cannot delete "general" category' 
            });
        }
        
        // Mover todas as imagens desta categoria para 'general'
        const [updatedCount] = await req.db.GalleryImage.update(
            { category: 'general' },
            { where: { category: name } }
        );
        
        console.log(`Moved ${updatedCount} images to general`);
        res.json({ 
            success: true, 
            message: `Category "${name}" deleted. ${updatedCount} images moved to "general".`,
            modifiedCount: updatedCount
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============================================
// ROTAS PRINCIPAIS DA GALERIA
// ============================================

// GET /api/gallery - Listar imagens
router.get('/', async (req, res) => {
    console.log('GET / - Fetching images, query:', req.query);
    try {
        const { category, page = 1, limit = 50 } = req.query;
        
        let whereClause = {};
        if (category && category !== 'all') {
            whereClause.category = category;
        }
        
        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        const { count, rows } = await req.db.GalleryImage.findAndCountAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: offset
        });
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imagesWithUrl = rows.map(img => ({
            ...img.toJSON(),
            url: `${baseUrl}${img.path}`
        }));
        
        console.log(`Found ${rows.length} images, total: ${count}`);
        res.json({ 
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / parseInt(limit)),
            images: imagesWithUrl 
        });
    } catch (error) {
        console.error('Error listing images:', error);
        res.status(500).json({ error: 'Erro ao listar imagens' });
    }
});

// POST /api/gallery/upload - Upload de imagem
router.post('/upload', authenticateJWT, upload.single('image'), async (req, res) => {
    console.log('=== UPLOAD ROUTE HIT ===');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada' });
        }

        const { alt_text, caption, description, category } = req.body;
        
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const relativePath = `/gallery/images/${year}/${month}/${req.file.filename}`;
        
        console.log('📂 Relative path:', relativePath);
        
        let metadata = {};
        try {
            metadata = await sharp(req.file.path).metadata();
            console.log('📐 Image dimensions:', metadata.width, 'x', metadata.height);
        } catch (err) {
            console.warn('Could not get metadata:', err);
        }
        
        // Criar thumbnail
        const thumbnailDir = path.join(__dirname, '../public/gallery/thumbnails');
        ensureDir(thumbnailDir);
        
        const thumbnailPath = path.join(thumbnailDir, req.file.filename);
        try {
            await sharp(req.file.path)
                .resize(300, 300, { fit: 'cover' })
                .toFile(thumbnailPath);
            console.log('✅ Thumbnail created');
        } catch (err) {
            console.warn('Could not create thumbnail:', err);
        }
        
        const imageData = {
            filename: req.file.filename,
            original_name: req.file.originalname,
            path: relativePath,
            mime_type: req.file.mimetype,
            size_bytes: req.file.size,
            width: metadata.width || null,
            height: metadata.height || null,
            alt_text: alt_text || req.file.originalname,
            caption: caption || '',
            description: description || '',
            category: category || 'general',
            created_by: req.user.id
        };

        const image = await req.db.GalleryImage.create(imageData);
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        
        res.status(201).json({
            success: true,
            image: {
                ...image.toJSON(),
                url: `${baseUrl}${relativePath}`
            }
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Erro ao fazer upload: ' + error.message });
    }
});

// GET /api/gallery/:id - Buscar imagem por ID
router.get('/:id', async (req, res) => {
    try {
        const image = await req.db.GalleryImage.findByPk(req.params.id);
        
        if (!image) {
            return res.status(404).json({ error: 'Imagem não encontrada' });
        }
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.json({
            ...image.toJSON(),
            url: `${baseUrl}${image.path}`
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Erro ao buscar imagem' });
    }
});

// PUT /api/gallery/:id - Atualizar imagem
router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const { alt_text, caption, description, category, featured } = req.body;
        
        const image = await req.db.GalleryImage.findByPk(req.params.id);
        
        if (!image) {
            return res.status(404).json({ error: 'Imagem não encontrada' });
        }
        
        await image.update({
            alt_text: alt_text !== undefined ? alt_text : image.alt_text,
            caption: caption !== undefined ? caption : image.caption,
            description: description !== undefined ? description : image.description,
            category: category || image.category,
            featured: featured !== undefined ? featured : image.featured
        });
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.json({
            ...image.toJSON(),
            url: `${baseUrl}${image.path}`
        });
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ error: 'Erro ao atualizar imagem' });
    }
});

// PATCH /api/gallery/:id/category - Atualizar categoria de uma imagem
router.patch('/:id/category', authenticateJWT, async (req, res) => {
    console.log('PATCH /:id/category - ID:', req.params.id);
    try {
        const { id } = req.params;
        const { category } = req.body;
        
        if (!category || category.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                error: 'Category is required' 
            });
        }
        
        const image = await req.db.GalleryImage.findByPk(id);
        
        if (!image) {
            return res.status(404).json({ 
                success: false, 
                error: 'Image not found' 
            });
        }
        
        await image.update({ category: category.trim().toLowerCase() });
        
        console.log('Image category updated:', image.id);
        res.json({ 
            success: true, 
            image: {
                ...image.toJSON(),
                url: `${req.protocol}://${req.get('host')}${image.path}`
            }
        });
    } catch (error) {
        console.error('Error updating image category:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// DELETE /api/gallery/:id - Remover imagem
router.delete('/:id', authenticateJWT, async (req, res) => {
    console.log('DELETE /:id - ID:', req.params.id);
    try {
        const image = await req.db.GalleryImage.findByPk(req.params.id);
        
        if (!image) {
            return res.status(404).json({ error: 'Imagem não encontrada' });
        }
        
        // Deletar arquivo físico
        const filePath = path.join(__dirname, '../public', image.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('🗑️ Deleted file:', filePath);
        }
        
        // Deletar thumbnail
        const thumbnailPath = path.join(__dirname, '../public/gallery/thumbnails', image.filename);
        if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
            console.log('🗑️ Deleted thumbnail:', thumbnailPath);
        }
        
        await image.destroy();
        
        res.json({ success: true, message: 'Imagem removida' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Erro ao deletar imagem' });
    }
});

export default router;