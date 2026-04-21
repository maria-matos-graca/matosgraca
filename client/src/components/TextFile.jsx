// components/TextFile.jsx
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TextFile = ({ filePath }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadContent = async () => {
            try {
                setLoading(true);
                const response = await fetch(filePath);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const text = await response.text();
      
                if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
                    throw new Error('Arquivo não encontrado. Recebido HTML em vez de Markdown.');
                }
                
                setContent(text);
                setError(null);
            } catch (err) {
                console.error('Error:', err);
                setError(`Não foi possível carregar: ${filePath}. ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [filePath]);

    if (loading) return <div className="loading">A carregar...</div>;
    if (error) return <div className="error">Erro: {error}</div>;
    
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
        </ReactMarkdown>
    );
};

export default TextFile;