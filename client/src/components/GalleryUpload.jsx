import { useState, useRef } from 'react';
import api from '../services/auth';

const GalleryUpload = ({ onUploadSuccess, English }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState('');
    const [description, setDescription] = useState('');
    const [altText, setAltText] = useState('');
    const [category, setCategory] = useState('general');
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(selectedFile.type)) {
            alert(English ? 'Only images are allowed (JPEG, PNG, WEBP, GIF)' : 'Apenas imagens são permitidas (JPEG, PNG, WEBP, GIF)');
            return;
        }
        
        if (selectedFile.size > 5 * 1024 * 1024) {
            alert(English ? 'Image must be less than 5MB' : 'A imagem deve ter menos de 5MB');
            return;
        }
        
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setAltText(selectedFile.name.split('.')[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert(English ? 'Please select an image' : 'Por favor selecione uma imagem');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('caption', caption);
        formData.append('description', description);
        formData.append('alt_text', altText);
        formData.append('category', category);

        try {
            // Usar api diretamente em vez do GalleryService
            const response = await api.post('/gallery/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.data.success) {
                // Reset form
                setFile(null);
                setPreview(null);
                setCaption('');
                setDescription('');
                setAltText('');
                setCategory('general');
                if (fileInputRef.current) fileInputRef.current.value = '';
                
                if (onUploadSuccess) onUploadSuccess();
                
                alert(English ? 'Image uploaded successfully!' : 'Imagem enviada com sucesso!');
            } else {
                throw new Error(response.data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert(English ? 'Error uploading image: ' + (error.response?.data?.error || error.message) : 'Erro ao enviar imagem: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreview(null);
        setCaption('');
        setDescription('');
        setAltText('');
        setCategory('general');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="gallery-upload">
            <h3>{English ? 'Upload New Image' : 'Enviar Nova Imagem'}</h3>
            
            <form onSubmit={handleSubmit}>
                <div 
                    className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    
                    {preview ? (
                        <div className="upload-preview">
                            <img src={preview} alt="Preview" />
                            <button 
                                type="button" 
                                className="remove-preview"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    resetForm();
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ) : (
                        <div className="upload-placeholder">
                            <div className="upload-icon">📷</div>
                            <p>{English ? 'Click or drag image here' : 'Clique ou arraste imagem aqui'}</p>
                            <small>{English ? 'JPG, PNG, WEBP, GIF up to 5MB' : 'JPG, PNG, WEBP, GIF até 5MB'}</small>
                        </div>
                    )}
                </div>

                {preview && (
                    <div className="upload-metadata">
                        <div className="form-group">
                            <label>{English ? 'Caption' : 'Legenda'}</label>
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder={English ? 'Brief description' : 'Descrição breve'}
                            />
                        </div>

                        <div className="form-group">
                            <label>{English ? 'Description' : 'Descrição'}</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                                placeholder={English ? 'Detailed description...' : 'Descrição detalhada...'}
                            />
                        </div>

                        <div className="form-group">
                            <label>{English ? 'Alt Text (SEO)' : 'Texto Alternativo (SEO)'}</label>
                            <input
                                type="text"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                placeholder={English ? 'Description for screen readers' : 'Descrição para leitores de ecrã'}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>{English ? 'Category' : 'Categoria'}</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="general">{English ? 'General' : 'Geral'}</option>
                                <option value="glimpses">{English ? 'Glimpses' : 'Vislumbres'}</option>
                                <option value="art">{English ? 'Art' : 'Arte'}</option>
                                <option value="personal">{English ? 'Personal' : 'Pessoal'}</option>
                                <option value="tech">{English ? 'Tech' : 'Tech'}</option>
                            </select>
                        </div>

                        <div className="form-buttons">
                            <button type="button" onClick={resetForm} className="btn-cancel">
                                {English ? 'Cancel' : 'Cancelar'}
                            </button>
                            <button type="submit" disabled={uploading} className="btn-submit">
                                {uploading ? (English ? 'Uploading...' : 'Enviando...') : (English ? 'Upload Image' : 'Enviar Imagem')}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default GalleryUpload;