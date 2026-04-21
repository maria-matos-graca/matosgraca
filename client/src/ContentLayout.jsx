import { useState, useEffect } from 'react';

const ContentLayout = ({title1, content1, title2, content2, isPostSelected = false, onBackToList }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showPost, setShowPost] = useState(false); 
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setShowPost(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    

    useEffect(() => {
        if (isMobile && isPostSelected) {
            setShowPost(true);
        }
    }, [isPostSelected, isMobile]);
    
    const handleListItemClick = () => {
        if (isMobile) {
            setShowPost(true);
        }
    };
    
    const handleBackToList = () => {
        setShowPost(false);
        if (onBackToList) {
            onBackToList();
        }
    };
    
   if (isMobile) {
    return (
        <main className="container">
            <div className="project-grid">
                {!showPost && (
                    <div className="project-card">
                        <h3>{title1}</h3>
                        <div onClick={handleListItemClick} style={{ cursor: 'pointer' }}>
                            {content1}
                        </div>
                    </div>
                )}
                
                {showPost && (
                    <div className="project-card active">
                        <h3>{title2}</h3>
                        {content2} 
                        <button className="back-to-list" onClick={handleBackToList}>
                            ← Voltar
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
    
    return (
        <main className="container">
            <div className="project-grid">
                <div className="project-card">
                    <h3>{title1}</h3>
                    {content1}
                </div>
                <div className="project-card">
                    <h3>{title2}</h3>
                    {content2}
                </div>
            </div>
        </main>
    );
};

export default ContentLayout;