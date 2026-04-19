import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from './services/auth';

const BlogPost = ({ English }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/blog/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Erro ao buscar post:', error);
        setError(English ? 'Post not found' : 'Publicação não encontrada');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, English]);

  if (loading) {
    return (
      <div className="loading">
        {English ? 'Loading...' : 'Carregando...'}
      </div>
    );
  }

  if (error || !post) {
    return (
      <>
        <Helmet>
          <title>{English ? 'Post Not Found | Matos Graça' : 'Post Não Encontrado | Matos Graça'}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="error">
          <h2>{error || (English ? 'Post not found' : 'Post não encontrado')}</h2>
          <button onClick={() => navigate('/blog')} className="back-button">
            {English ? 'Back to Blog' : 'Voltar ao Blog'}
          </button>
        </div>
      </>
    );
  }

  // dados para SEO
  const postTitle = post.title || 'Sem título';
  const postContent = post.content || post.text || '';
  const postDate = post.createdAt || post.created_at || post.date || new Date().toISOString();
  const postExcerpt = postContent.substring(0, 160);
  const postUrl = `https://matosgraca.com/blog/${post.id}`;

  return (
    <>
      <Helmet>
        <title>{`${postTitle} | Matos Graça Blog`}</title>
        <meta name="description" content={postExcerpt} />
        <meta name="keywords" content={`${postTitle}, blog, artigo, tecnologia, programação`} />
        <meta property="og:title" content={`${postTitle} | Matos Graça`} />
        <meta property="og:description" content={postExcerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta property="article:published_time" content={postDate} />
        <meta property="article:author" content="Matos Graça" />
        <meta property="article:section" content="Technology" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${postTitle} | Matos Graça`} />
        <meta name="twitter:description" content={postExcerpt} />
        <link rel="canonical" href={postUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": postTitle,
            "description": postExcerpt,
            "datePublished": postDate,
            "dateModified": post.updatedAt || post.updated_at || postDate,
            "author": {
              "@type": "Person",
              "name": "Matos Graça"
            },
            "url": postUrl,
            "mainEntityOfPage": postUrl
          })}
        </script>
      </Helmet>
      
      <div className="container">
       
        
        <article>
         
         
          <div className="project-card-wide">  <div className="section-label">{postTitle}</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {postContent.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="post-date">
              <time dateTime={postDate}>
                {new Date(postDate).toLocaleDateString(
                  English ? 'en-US' : 'pt-PT',
                  { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }
                )}
              </time>
            </div>
            <button onClick={() => navigate('/blog')} className="back-button">← {English ? 'Back to Blog' : 'Voltar ao Blog'}
        </button>
          </div>
        </article>
      </div>
    </>
  );
};

export default BlogPost;