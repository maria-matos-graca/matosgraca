import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Home from './Home.jsx';
import Navbar from './Navbar.jsx';
import Login from './Login.jsx';
import About from './About.jsx';
import GalleryPage from './GalleryPage.jsx';
import BlogPost from './BlogPost.jsx';
import Contact from './Contact.jsx';
import NotFound from './NotFound.jsx';
import Escrever from './Escrever.jsx';
import AdminGallery from './AdminGallery.jsx';
import Blog from './Blog.jsx';
import { authService } from './services/auth';
import MobileMenu from './components/MobileMenu';
import Footer from './components/Footer';

const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  const [English, setLanguageToggle] = useState(true);
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstRender(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <Helmet>
        <html lang={English ? "en" : "pt"} />
        <title>Matos Graça | Humanidades e Tecnologia</title>
        <meta name="description" content={English 
          ? "Personal blog about art, technology and humanities" 
          : "Blog pessoal sobre arte, tecnologia e humanidades"} />
        <meta name="keywords" content="blog, arte, humanidades, tecnologia, react, nodejs, portfolio" />
        <meta name="author" content="Matos Graça" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Matos Graça | Humanidades  e Tecnologia" />
        <meta property="og:description" content={English 
          ? "Personal blog about art, technology and humanities" 
          : "Blog pessoal sobre arte, tecnologia e humanidades"} />
        <meta property="og:site_name" content="Matos Graça" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Matos Graça | Humanidades e Tecnologia" />
        <meta name="twitter:description" content={English 
          ? "Personal blog about art, technology and humanities" 
          : "Blog pessoal sobre arte, tecnologia e humanidades"} />
        
        {/* Robots */}
        <meta name="robots" content="index, follow" />
        
        {/* Canonical URL - atualiza com teu domínio depois */}
        <link rel="canonical" href="https://matosgraca.com/" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Helmet>
      
      <Router>
            <MobileMenu 
        English={English} 
        setLanguageToggle={setLanguageToggle}
        />
        <div className="astro_quote desktop-only">
        <div className="moon"></div>
        <div className="planet-shade"></div>
          <h1>
            {English ?
              <div className={isFirstRender ? "is-initial-load" : ""}>
                <div className="quote">
                  <div className="learn">Ancora imparo</div>
                  <div className="author">"I'm still learning" - Michelangelo at age 87</div>
                </div>
              </div> :
              <div className="quote">
                <div className="learn">Ancora imparo</div>
                <div className="author">"Ainda estou a aprender" - Miguelângelo aos 87 anos</div>
              </div>
            }
          </h1>
</div>

       {/* Overlay mobile com eclipse */}
<div className="astro_quote mobile-only">
    <div className="moon mobile-only"></div>
    <div className="planet-shade mobile-only"></div>
</div>



        <div className={isFirstRender ? "is-initial-load" : ""}>
          <div className="languageToggle">
            <label className="switchLan">
              {English ? 
                <h3> Português?</h3> : 
                <h3> English?</h3>
              }
            </label>
            <label className="switch">
              <input 
                type="checkbox"
                onChange={() => setLanguageToggle(!English)}
              />
              <div className="slider round"></div>
            </label>
          </div>
        </div>
        <div className="header">
                    
          

        </div>
   
        <div className="App">
          <div className="content">
            <div className="background"></div>
            <div className={isFirstRender ? "is-initial-load" : ""}>
              <Navbar English={English} />
              
              <Routes>

                <Route path="/admingallery" 
                  element={
                   <ProtectedRoute>
                      <AdminGallery English={English} />
                   </ProtectedRoute>  } />
                {/* Rotas públicas */}
                <Route path="/" element={<Home English={English} />} />
                <Route path="/about" element={<About English={English} />} />
                <Route path="/gallerypage" element={<GalleryPage English={English} />} />
                <Route path="/contact" element={<Contact English={English} />} />
                <Route path="/blog" element={<Blog English={English} />} />
                <Route path="/blog/:id" element={<BlogPost English={English} />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/escrever" 
                  element={
                    <ProtectedRoute>
                      <Escrever English={English} />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound English={English} />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
      <Footer English={English} />
    </>
  );
}

export default App;