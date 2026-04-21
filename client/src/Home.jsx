import { useState, useEffect } from 'react';
import ContentLayout from "./ContentLayout";
import useFetch from "./UseFetch";
import { Link } from 'react-router-dom';

const Home = ({English}) => {
    const [selectedPost, setSelectedPost] = useState(null);
    const [isPostSelected, setIsPostSelected] = useState(selectedPost);
    const { data: blogs, isPending, error } = useFetch('/blog');
    
    const formatDate = (dateString) => {
        if (!dateString) return 'Data desconhecida';
        const date = new Date(dateString);
        return date.toLocaleDateString(English ? 'en-US' : 'pt-PT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    
    useEffect(() => {
        if (blogs && blogs.length > 0 && !selectedPost) {
            setSelectedPost(blogs[0]);
        }
    }, [blogs, selectedPost]);
    
    const handleSelectPost = (post) => {
        setSelectedPost(post);
        setIsPostSelected(true);
    };
    
    const handleBackToList = () => {
        setIsPostSelected(false);
    };
    
    const blogListContent = (
        <div className="blog-list-home">
            {isPending && <p>{English ? 'Loading posts...' : 'A carregar publicações...'}</p>}
            {error && <p style={{color: 'white'}}>{English ? 'Error loading posts' : 'Erro ao carregar publicações'}</p>}
            {blogs && blogs.length === 0 && <p>{English ? 'No posts yet.' : 'Ainda não há publicações.'}</p>}
            {blogs && blogs.slice(0,4).map(post => (
                <div 
                    key={post.id} 
                    className={`blog-list-item ${selectedPost?.id === post.id ? 'active' : ''}`}
                    onClick={() => handleSelectPost(post)}
                >
                    <h3 style={{margin: '0 0 5px 0', fontSize: '18px'}}>
                        {post.title || 'Sem título'}
                    </h3>
                    <p style={{margin: 0, fontSize: '12px', color: '#666'}}>
                        {formatDate(post.createdAt || post.created_at || post.date)}
                    </p>
                    <p style={{margin: '5px 0 0 0', fontSize: '14px', color: '#888'}}>
                        {(post.content || post.text || '').substring(0, 80)}...
                    </p>
                </div>
            ))}
        </div>
    );
    
    const postTitle = selectedPost ? (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
            <h3 style={{margin: 0}}>{selectedPost.title}</h3>
            {selectedPost === blogs?.[0] && (
                <span style={{
                    fontSize: '12px',
                    backgroundColor: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '12px'
                }}>
                    {English ? 'Latest' : 'Mais recente'}
                </span>
            )}
        </div>
    ) : <h3>{""}</h3>;

    const selectedPostContent = selectedPost ? (
        <div className="selected-post">
            <p style={{fontSize: '14px', color: '#666', marginBottom: '20px'}}>
                {formatDate(selectedPost.createdAt || selectedPost.created_at || selectedPost.date)}
            </p>
            <div className="selected-post-content">
                {(selectedPost.content || selectedPost.text || '').split('\n').map((paragraph, idx) => (
                    paragraph.trim() && <p key={idx}>{paragraph}</p>
                ))}
            </div>
            <Link 
                to={`/blog/${selectedPost.id}`}
                style={{
                    display: 'inline-block',
                    marginTop: '20px',
                    textDecoration: 'none'
                }}
            >
                <div className="read-full-post" style={{color: "black"}} > {English ? 'Read full post →' : 'Ler publicação completa →'}</div> 
            </Link>
        </div>
    ) : (
        <div style={{textAlign: 'center', padding: '40px 20px', color: '#999'}}>
            {isPending ? (
                English ? 'Loading...' : 'A carregar...'
            ) : (
                English 
                    ? 'No posts available. Check back soon!' 
                    : 'Nenhuma publicação disponível. Volta em breve!'
            )}
        </div>
    );
    
    const blogContent = (
        <div>
            {selectedPostContent}
            <Link 
                to="/blog"
                style={{
                    display: 'inline-block',
                    color: '#666',
                    textDecoration: 'none',
                    fontSize: '14px',
                }}
            >
                {English && blogs? 'Read more' : blogs? 'Ler mais' : ""}
            </Link>
        </div>
    );
    
    return (
        <ContentLayout
            title1={English ? 'Latest Blog Posts' : 'Últimas publicações do Blog'}
            content1={blogListContent}
            title2={postTitle}
            content2={blogContent}
            isPostSelected={isPostSelected}
            onBackToList={handleBackToList} 
        />
    );
}

export default Home;