import { useState, useEffect } from 'react';
import api from '../services/auth';
import { createPortal } from 'react-dom';

const Gallery = ({ English }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [category, setCategory] = useState('all');

    useEffect(() => {
        fetchImages();
    }, [category]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/gallery?category=${category}&limit=50`);
            setImages(response.data.images || []);
        } catch (error) {
            console.error('Erro ao carregar galeria:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ CORRETO - Loading state
    if (loading) {
        return <div className="gallery-loading">
            {English ? 'Loading gallery...' : 'Carregando galeria...'}
        </div>;
    }

    const content = (
        <div>
            <h3> {English? 'Gallery':'Galeria'}</h3>
            <div className="gallery-filters">
                <button 
                    className={category === 'all' ? 'active' : ''} 
                    onClick={() => setCategory('all')}
                >
                    {English ? 'All' : 'Tudo'}
                </button>
                <button 
                    className={category === 'glimpses' ? 'active' : ''} 
                    onClick={() => setCategory('glimpses')}
                >
                    {English ? 'Glimpses' : 'Vislumbres'}
                </button>
                <button 
                    className={category === 'art' ? 'active' : ''} 
                    onClick={() => setCategory('art')}
                >
                    {English ? 'My Art' : 'Arte minha'}
                </button>
                                <button 
                    className={category === 'personal' ? 'active' : ''} 
                    onClick={() => setCategory('personal')}
                >
                    {English ? 'Personal' : 'Pessoal'}
                </button>
                <button 
                    className={category === 'tech' ? 'active' : ''} 
                    onClick={() => setCategory('tech')}
                >
                    {'Tech metaphors'}
                </button>

            </div>

            <div className="gallery-grid">
                {images.length === 0 ? (
                    <p className="no-images">
                        {English ? 'No images found' : 'Nenhuma imagem encontrada'}
                    </p>
                ) : (
                    images.map((image) => (
                        <div 
                            key={image.id} 
                            className="gallery-item"
                            onClick={() => setSelectedImage(image)}
                        >
                            <img 
                                src={image.url} 
                                alt={image.alt_text || image.caption || 'Gallery image'}
                                loading="lazy"
                            />
                            {image.caption && (
                                <div className="gallery-caption">{image.caption}</div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {selectedImage && createPortal(
                <div className="gallery-modal" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage.url} alt={selectedImage.caption} />
                        <div className="modal-info">
                            <h4>{selectedImage.caption}</h4>
                            <p>{selectedImage.description}</p>
                            <small>
                                {new Date(selectedImage.created_at).toLocaleDateString()}
                            </small>
                        </div>
                        <button 
                            className="close-btn" 
                            onClick={() => setSelectedImage(null)}
                        >
                            ×
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );

    return content;
};

export default Gallery;