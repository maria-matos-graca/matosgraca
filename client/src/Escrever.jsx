import React, { useState, useEffect } from 'react';
import { authService } from './services/auth';
import { useNavigate } from 'react-router-dom';
import api from './services/auth';

const Escrever = () => {
  const [title, setTitle] = useState('');
  const [content, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está autenticado
    if (!authService.isAuthenticated()) {
      navigate('/Login');
    } else {
      fetchPosts();
    }
  }, [navigate]);

  // Buscar todos os posts
  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await api.get('/blog');
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      setMessage('Erro ao carregar lista de posts');
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/blog/', {
        title,
        content
      });

      setMessage('Post criado com sucesso!');
      setTitle('');
      setBody('');
      fetchPosts(); // Recarregar a lista
      
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.logout();
        navigate('/login');
      } else {
        setMessage('Erro ao criar post: ' + (error.response?.data?.error || 'Erro desconhecido'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/blog/${id}`);
      setMessage('Publicação eliminada com sucesso!');
      fetchPosts(); // Recarregar a lista
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Erro ao eliminar:', error);
      setMessage('Erro ao eliminar: ' + (error.response?.data?.error || 'Erro desconhecido'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data desconhecida';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Escrever Nova Publicação</h2>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Sair
        </button>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
            placeholder="Título da Publicação"
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label>Conteúdo</label>
          <textarea
            value={content}
            onChange={(e) => setBody(e.target.value)}
            required
            style={styles.textarea}
            placeholder="Escreve aqui..."
            rows="10"
          />
        </div>
        
        {message && (
          <div style={message.includes('sucesso') ? styles.success : styles.error}>
            {message}
          </div>
        )}
        
        <button 
          type="submit" 
          style={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'A publicar...' : 'Publicar Publicação'}
        </button>
      </form>

      {/* Lista de posts existentes */}
      <div style={styles.postsSection}>
        <h3 style={styles.postsTitle}>Publicações Existentes</h3>
        
        {loadingPosts ? (
          <p>Carregando Publicações...</p>
        ) : posts.length === 0 ? (
          <p style={styles.noPosts}>Nenhum post encontrado.</p>
        ) : (
          <div style={styles.postsList}>
            {posts.map((post) => (
              <div key={post.id} style={styles.postCard}>
                <div style={styles.postInfo}>
                  <h4 style={styles.postTitle}>{post.title}</h4>
                  <div style={styles.postMeta}>
                    <span>ID: {post.id.substring(0, 8)}...</span>
                    <span>{formatDate(post.created_at || post.createdAt)}</span>
                  </div>
                  <p style={styles.postPreview}>
                    {(post.content || post.text || '').substring(0, 100)}...
                  </p>
                </div>
                <div style={styles.postActions}>
                  {showDeleteConfirm === post.id ? (
                    <div style={styles.confirmBox}>
                      <span style={styles.confirmText}>Confirmar eliminação?</span>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        style={{...styles.confirmButton, ...styles.confirmYes}}
                      >
                        {deletingId === post.id ? 'A eliminar...' : 'Sim'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        style={{...styles.confirmButton, ...styles.confirmNo}}
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(post.id)}
                      style={styles.deleteButton}
                      title="Eliminar publicação"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  logoutButton: {
    margin: '20px',
    padding: '8px 16px',
    background: 'white',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    marginBottom: '50px',
    paddingBottom: '30px',
    borderBottom: '2px solid #eee'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  input: {
    marginTop: '20px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px'
  },
  textarea: {
    marginTop: '20px',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  submitButton: {
    padding: '14px',
    background: 'white',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  success: {
    padding: '12px',
    background: '#d4edda',
    color: '#155724',
    borderRadius: '5px',
    textAlign: 'center'
  },
  error: {
    padding: '12px',
    background: '#f8d7da',
    color: '#721c24',
    borderRadius: '5px',
    textAlign: 'center'
  },
  postsSection: {
    marginTop: '20px'
  },
  postsTitle: {
    marginBottom: '20px',
    fontSize: '1.5rem',
    color: 'white'
  },
  postsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  postCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #eee',
    transition: 'box-shadow 0.2s'
  },
  postInfo: {
    flex: 1
  },
  postTitle: {
    margin: '0 0 8px 0',
    fontSize: '1.1rem',
    color: '#333'
  },
  postMeta: {
    display: 'flex',
    gap: '15px',
    marginBottom: '8px',
    fontSize: '0.8rem',
    color: '#666'
  },
  postPreview: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#888'
  },
  postActions: {
    marginLeft: '15px'
  },
  deleteButton: {
    padding: '8px 16px',
    background: 'white',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'background 0.2s'
  },
  confirmBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#fff3cd',
    padding: '8px 12px',
    borderRadius: '5px'
  },
  confirmText: {
    fontSize: '0.85rem',
    color: '#856404'
  },
  confirmButton: {
    padding: '4px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  confirmYes: {
    background: 'white',
    color: 'black'
  },
  confirmNo: {
    background: '#6c757d',
    color: 'white'
  },
  noPosts: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    background: '#f9f9f9',
    borderRadius: '8px'
  }
};

export default Escrever;