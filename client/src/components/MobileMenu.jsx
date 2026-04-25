import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MobileWarning from './MobileWarning';

const MobileMenu = ({ English, setLanguageToggle, English: isEnglish }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sliderWidth, setSliderWidth] = useState(50);
    const [ballSize, setBallSize] = useState(22);
    const menuRef = useRef(null);
    const hamburgerRef = useRef(null);
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    const closeMenu = () => {
        setIsOpen(false);
    };
    
    const toggleLanguage = () => {
        setLanguageToggle(!isEnglish);
    };


    //estudar isto melhor:
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && 
                menuRef.current && 
                !menuRef.current.contains(event.target) &&
                hamburgerRef.current &&
                !hamburgerRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        // Adiciona o event listener
        document.addEventListener('mousedown', handleClickOutside);
        
        // Remove o event listener na limpeza
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

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
            <div className="mobile_only mobile-header">
                <button 
                    className="hamburger-menu" 
                    onClick={toggleMenu}
                    ref={hamburgerRef}
                >
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                </button>
                
                {/* Citação na barra */}
                <div className="mobile-quote">
                    <div className="learn">
                        {'matosgraca.com'}
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

                <div 
                    className={`mobile-nav ${isOpen ? 'open' : ''}`}
                    ref={menuRef}
                >
                    <ul>
                        <li><Link to="/home" onClick={closeMenu}>{English ? 'Home' : 'Início'}</Link></li>
                        <li><Link to="/about" onClick={closeMenu}>{English ? 'About' : 'Sobre'}</Link></li>
                        <li><Link to="/gallerypage" onClick={closeMenu}>{English ? 'Gallery' : 'Galeria'}</Link></li>
                        <li><Link to="/contact" onClick={closeMenu}>{English ? 'Contact' : 'Contacto'}</Link></li>
                    </ul>
                </div>
                
                <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={closeMenu}></div>
            </div>
        </>
    );
};

export default MobileMenu;