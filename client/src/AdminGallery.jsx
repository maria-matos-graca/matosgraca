// frontend/src/components/AdminGallery.jsx
import { useState, useEffect } from 'react';
import GalleryUpload from './components/GalleryUpload';
import ImageCard from './components/ImageCard';
import EditImageModal from './components/EditImageModal';
import GalleryService from './services/GalleryService';

const AdminGallery = ({ English }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [category, setCategory] = useState('all');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    // Carregar imagens
    useEffect(() => {
        fetchImages();
    }, [category, page]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 12 };
            if (category !== 'all') params.category = category;
            
            const data = await GalleryService.getImages(params);
            setImages(data.images || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Error fetching images:', error);
            alert(English ? 'Error loading gallery' : 'Erro ao carregar galeria');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (image) => {
        setSelectedImage(image);
    };

    const handleUpdate = (updatedImage) => {
        setImages(images.map(img => 
            img.id === updatedImage.id ? updatedImage : img
        ));
    };

    const handleDelete = async (image) => {
        const confirmMessage = English 
            ? `Delete "${image.caption || image.alt_text}"? This action cannot be undone.`
            : `Eliminar "${image.caption || image.alt_text}"? Esta ação não pode ser desfeita.`;
        
        if (window.confirm(confirmMessage)) {
            try {
                await GalleryService.deleteImage(image.id);
                fetchImages();
                alert(English ? 'Image deleted successfully' : 'Imagem eliminada com sucesso');
            } catch (error) {
                console.error('Delete error:', error);
                alert(English ? 'Error deleting image' : 'Erro ao eliminar imagem');
            }
        }
    };

    const handleUploadSuccess = () => {
        fetchImages();
        document.querySelector('.gallery-list')?.scrollIntoView({ behavior: 'smooth' });
    };

    const totalPages = Math.ceil(total / 12);

    return (
        <div className="admin-gallery-container">
            <section className="upload-section">
                <GalleryUpload onUploadSuccess={handleUploadSuccess} English={English} />
            </section>

            <section className="gallery-section">
                <div className="gallery-header">
                    <h2>{English ? 'Image Gallery' : 'Galeria de Imagens'}</h2>
                    
                    <div className="gallery-filters">
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="all">{English ? 'All Categories' : 'Todas Categorias'}</option>
                            <option value="general">{English ? 'General' : 'Geral'}</option>
                            <option value="portfolio">{English ? 'Portfolio' : 'Portfólio'}</option>
                            <option value="personal">{English ? 'Personal' : 'Pessoal'}</option>
                            <option value="travel">{English ? 'Travel' : 'Viagens'}</option>
                            <option value="featured">{English ? 'Featured' : 'Destaque'}</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">{English ? 'Loading...' : 'Carregando...'}</div>
                ) : images.length === 0 ? (
                    <div className="empty-gallery">
                        <p>{English ? 'No images in the gallery yet.' : 'Ainda não há imagens na galeria.'}</p>
                        <p>{English ? 'Use the upload form above to add images.' : 'Use o formulário acima para adicionar imagens.'}</p>
                    </div>
                ) : (
                    <>
                        <div className="gallery-grid">
                            {images.map(image => (
                                <ImageCard
                                    key={image.id}
                                    image={image}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    English={English}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    ← {English ? 'Previous' : 'Anterior'}
                                </button>
                                <span>{English ? `Page ${page} of ${totalPages}` : `Página ${page} de ${totalPages}`}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    {English ? 'Next' : 'Próxima'} →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {selectedImage && (
                <EditImageModal
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
                    onUpdate={handleUpdate}
                    English={English}
                />
            )}
        </div>
    );
};

export default AdminGallery;