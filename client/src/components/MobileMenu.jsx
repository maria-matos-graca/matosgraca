import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const MobileMenu = ({ English, setLanguageToggle, English: isEnglish }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sliderWidth, setSliderWidth] = useState(50);
    const [ballSize, setBallSize] = useState(22);
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    const closeMenu = () => {
        setIsOpen(false);
    };
    
    const toggleLanguage = () => {
        setLanguageToggle(!isEnglish);
    };

     useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            if (width <= 480) {
                setSliderWidth(40);
                setBallSize(18);
            } else {
                setSliderWidth(50);
                setBallSize(22);
            }
        };
        
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    
    const translateDistance = sliderWidth - ballSize - 4;
    
    
    return (
        <>
            <div className="mobile-only mobile-header">
            <div className="mobile-header">
                <button className="hamburger-menu" onClick={toggleMenu}>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                </button>
                
                {/* Citação na barra */}
                <div className="mobile-quote">
                    <div className="learn">
                        {"Ancora imparo"}
                    </div>
                    <div className="author">
                    </div>
                </div>
                
                <div className="mobile-toggle">

                   <label className="switchLan">
                        <h3>{isEnglish ? "PT" : "EN"}</h3>
                    </label>
                    <label className="switch">
                        <input 
                            type="checkbox"
                            checked={!isEnglish}
                            onChange={toggleLanguage}
                        />
                        <div 
                            className="slider round"
                            style={{
                                position: 'relative',
                                display: 'inline-block',
                                width: sliderWidth,
                                height: sliderWidth * 0.56
                            }}
                        >
                            <div 
                                style={{
                                    position: 'absolute',
                                    content: '""',
                                    height: ballSize,
                                    width: ballSize,
                                    left: 3,
                                    bottom: 3,
                                    backgroundColor: 'white',
                                    transition: '.4s',
                                    borderRadius: '50%',
                                    transform: !isEnglish ? `translateX(${translateDistance}px)` : 'translateX(0)'
                                }}
                            />
                        </div>
                    </label>
                </div>
            </div>

            
            <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><Link to="/" onClick={closeMenu}>{English ? 'Home' : 'Início'}</Link></li>
                    <li><Link to="/about" onClick={closeMenu}>{English ? 'About' : 'Sobre'}</Link></li>
                    <li><Link to="/gallerypage" onClick={closeMenu}>{English ? 'Gallery' : 'Galeria'}</Link></li>
                    <li><Link to="/contact" onClick={closeMenu}>{English ? 'Contact' : 'Contato'}</Link></li>
                </ul>
            </div>
            
            <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={closeMenu}></div></div>
        </>
    );
};

export default MobileMenu;