import { Link } from 'react-router-dom';
const Navbar = ({English}) => {
    if(English)
    return (
        <nav className="nav">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/gallerypage">Gallery</Link></li>
                    <li><Link to="/contact">Contact me</Link></li>
                </ul>

                
        </nav>
    )
    return (
        <nav className="nav">
                <ul>
                    <li><Link to="/">Início</Link></li>
                    <li><Link to="/about">Sobre</Link></li>
                    <li><Link to="/gallerypage">Galeria</Link></li>
                    <li><Link to="/contact">Contacta-me</Link></li>
                </ul>
        </nav>
    )
}
 
export default Navbar;