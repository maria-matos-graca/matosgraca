// frontend/src/components/EditImageModal.jsx
import { useState, useEffect } from 'react';
import GalleryService from '../services/GalleryService';

const EditImageModal = ({ image, onClose, onUpdate, English }) => {

    const [caption, setCaption] = useState('');
    const [description, setDescription] = useState('');
    const [altText, setAltText] = useState('');
    const [category, setCategory] = useState('');
    const [featured, setFeatured] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (image) {
            setCaption(image.caption || '');
            setDescription(image.description || '');
            setAltText(image.alt_text || '');
            setCategory(image.category || 'general');
            setFeatured(image.featured || false);
        }
    }, [image]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const updated = await GalleryService.updateImage(image.id, {
                caption,
                description,
                alt_text: altText,
                category,
                featured
            });
            
            onUpdate(updated);
            onClose();
        } catch (error) {
            console.error('Update error:', error);
            alert(English ? 'Error updating image' : 'Erro ao atualizar imagem');
        } finally {
            setSaving(false);
        }
    };

    if (!image) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{English ? 'Edit Image' : 'Editar Imagem'}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    <div className="edit-preview">
                        <img src={image.url} alt={image.alt_text} />
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>{English ? 'Caption' : 'Legenda'}</label>
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>{English ? 'Description' : 'Descrição'}</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>{English ? 'Alt Text (SEO)' : 'Texto Alternativo (SEO)'}</label>
                            <input
                                type="text"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>{English ? 'Category' : 'Categoria'}</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="general">{English ? 'General' : 'Geral'}</option>
                                    <option value="portfolio">{English ? 'Portfolio' : 'Portfólio'}</option>
                                    <option value="personal">{English ? 'Personal' : 'Pessoal'}</option>
                                    <option value="travel">{English ? 'Travel' : 'Viagens'}</option>
                                    <option value="featured">{English ? 'Featured' : 'Destaque'}</option>
                                </select>
                            </div>
                            
                            <div className="form-group checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={featured}
                                        onChange={(e) => setFeatured(e.target.checked)}
                                    />
                                    {English ? 'Featured image' : 'Imagem em destaque'}
                                </label>
                            </div>
                        </div>
                        
                        <div className="form-buttons">
                            <button type="button" onClick={onClose} className="btn-cancel">
                                {English ? 'Cancel' : 'Cancelar'}
                            </button>
                            <button type="submit" disabled={saving} className="btn-submit">
                                {saving ? (English ? 'Saving...' : 'A guardar...') : (English ? 'Save Changes' : 'Guardar Alterações')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditImageModal;