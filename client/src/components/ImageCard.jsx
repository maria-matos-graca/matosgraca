import { useState } from 'react';

const ImageCard = ({ image, onEdit, onDelete, English }) => {
    const [showActions, setShowActions] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(English ? 'en-US' : 'pt-PT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        if (onEdit) onEdit(image);
    };

    // Handler para eliminar - previne propagação
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        if (onDelete) onDelete(image);
    };

    return (
        <div 
            className="image-card"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            style={{
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: '8px',
                background: '#f5f5f5',
                aspectRatio: '4/3'
            }}
        >
            <img 
                src={image.url} 
                alt={image.alt_text || image.caption || 'Gallery image'}
                loading="lazy"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                }}
            />
            
            {/* Overlay que aparece ao hover */}
            <div 
                className="image-overlay"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '12px',
                    opacity: showActions ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    color: 'white'
                }}
            >
                <div className="image-info">
                    {image.caption && (
                        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                            {image.caption.length > 30 ? image.caption.substring(0, 30) + '...' : image.caption}
                        </div>
                    )}
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>
                        {formatDate(image.created_at)}
                    </div>
                    {image.category && (
                        <span style={{
                            display: 'inline-block',
                            background: '#007bff',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            marginTop: '6px'
                        }}>
                            {image.category}
                        </span>
                    )}
                </div>
                
                <div className="image-actions" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleEditClick}
                        style={{
                            background: 'white',
                            border: 'none',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title={English ? 'Edit' : 'Editar'}
                    >
                        ✏️
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        style={{
                            background: 'white',
                            border: 'none',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title={English ? 'Delete' : 'Eliminar'}
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCard;