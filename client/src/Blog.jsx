import { Helmet } from 'react-helmet-async';
import useFetch from "./UseFetch";
import { Link } from 'react-router-dom';

const Blog = ({ English }) => {
    const { data: blogs, isPending, error } = useFetch('/api/blog');
    
    console.log('Dados recebidos:', blogs);
    console.log('Carregando:', isPending);
    console.log('Erro:', error);

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Erro: {error}</div>;
    if (!blogs) return <div>Nenhum dado encontrado</div>;
    if (!Array.isArray(blogs)) return <div>Formato de dados inválido</div>;
    if (blogs.length === 0) return <div>Nenhum post encontrado</div>;

    const postCount = blogs.length;

    return (
        <>
            <Helmet>
                <title>{English ? 'Blog | Matos Graça' : 'Blog | Matos Graça'}</title>
                <meta name="description" content={English 
                    ? `Articles about art, technology and humanities. ${postCount} posts available.` 
                    : `Artigos sobre arte, tecnologia e humanidades. ${postCount} posts disponíveis.`} />
                <meta name="keywords" content="blog, programação, desenvolvimento, tecnologia, artigos, posts" />
                
                {/* Open Graph */}
                <meta property="og:title" content={English ? "Blog | Matos Graça" : "Blog | Matos Graça"} />
                <meta property="og:description" content={English 
                    ? "Articles about art, technology and humanities" 
                    : "Artigos sobre arte, tecnologia e humanidades"} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://matosgraca.com/blog" />
                
                {/* Twitter */}
                <meta name="twitter:title" content={English ? "Blog | Matos Graça" : "Blog | Matos Graça"} />
                <meta name="twitter:description" content={English 
                    ? "Articles about art, technology and humanities" 
                    : "Artigos sobre arte, tecnologia e humanidades"} />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://matosgraca.com/blog" />
                
                {/* Breadcrumbs para SEO */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        "name": "Matos Graça Blog",
                        "description": English 
                            ? "Personal blog about humanities and technology"
                            : "Blog pessoal sobre humanidades e tecnologia",
                        "url": "https://matosgraca.com/blog",
                        "numberOfPosts": postCount,
                        "author": {
                            "@type": "Person",
                            "name": "Matos Graça"
                        }
                    })}
                </script>
            </Helmet>
            
            <main className="container">  
                        <div className="blog-list">
                            {blogs.map(post => (
                                <div className="project-card" key={post.id}>
                                        <Link to={`/blog/${post.id}`}>
                                            <p style={{
                                                fontSize: '15px', 
                                                color: 'gray', 
                                                border: '1px solid lightgray', 
                                                padding: '5px', 
                                                borderRadius: '5px', 
                                                width: 'fit-content'
                                            }}>
                                                {post.createdAt || post.created_at || post.date 
                                                    ? new Date(post.createdAt || post.created_at || post.date).toLocaleDateString() 
                                                    : 'Data desconhecida'}
                                            </p>
                                            <p style={{fontSize: '35px', fontWeight:'500', color:'black'}}>{post.title || 'Sem título'}</p>
                                            <p style={{fontSize: '20px', fontWeight:'100', color:'black'}}>
                                                {(post.content || post.text || 'Sem conteúdo').substring(0, 150)}
                                                {(post.content || post.text || '').length > 150 ? '...' : ''}
                                            </p>
                                        </Link>
                                    </div>
                                
                            ))}
                        </div> 
              
               
            </main>
        </>
    );
}

export default Blog;