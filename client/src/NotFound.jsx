import ContentLayout from './ContentLayout';
import { Link } from 'react-router-dom';

const NotFound = ({English}) => {
    if(English)
    return (
        <ContentLayout
            isFirstRender={false}
            label="404 Not Found"
            title1="Page Not Found"
            content1={<p>Sorry, the page you are looking for does not exist.</p>}
            title2="Oops! Nothing here"
            content2={<Link to="/"><p>Return Home</p></Link>}
        />  
    )
    return (
        <ContentLayout
            isFirstRender={false}
            label="404 Não Encontrado"
            title1="Página Não Encontrada"
            content1={<p>Desculpe, a página que você está procurando não existe.</p>}
            title2="Ups! Nada aqui"
            content2={
            <Link to="/">
                <p>Voltar para a Página Inicial</p></Link>}
        />  
    )
}
 
export default NotFound;