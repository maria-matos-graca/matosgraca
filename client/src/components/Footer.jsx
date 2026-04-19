// components/SimpleFooter.jsx
import { useState, useEffect } from 'react';

const Footer = ({ English }) => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    
    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);
    
    return (
        <footer className="simple-footer">
            <div className="simple-footer-content">
                <p>
                    © {currentYear} Matos Graça. 
                    {English ? ' All rights reserved.' : ' Todos os direitos reservados.'}
                </p>
                <p className="credits">
                    {English ? 'Built with React' : 'Construído com React'}
                </p>
            </div>
        </footer>
    );
};

export default Footer;