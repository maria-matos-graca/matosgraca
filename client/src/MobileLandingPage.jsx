import React from 'react';
import { useState, useEffect } from 'react';
import TextFile from "./components/TextFile.jsx";
import SingleCardContentLayout from './components/SingleCardContentLayout';
import useFetch from './components/UseFetch.jsx';
import { Link } from 'react-router-dom';


const MobileLandingPage = ({English}) => {
/*const { data: blogs, isPending, error } = useFetch('/blog');
useEffect(() => {
  if (blogs && blogs.length > 0) {
    const ultimoPost = getUltimoPost();
    console.log('Último post:', ultimoPost);
  }
}, [blogs]);

const getUltimoPost = () => {
  if (!blogs || blogs.length === 0) return null;
  
  const ultimoPostId = [...blogs].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )[0];
  
  return ultimoPostId;
};
*/

  return (
    <div className="landing-page">
        <div className="special-astro">
        <div className="special-moon"></div>
        <div className="special-planet-shade"></div></div>
          {English?
                 <div className="special-quote">
                  <div className="special-learn">Ancora imparo</div>
                 <div>"I'm still learning" <br></br> - Michelangelo at age 87</div>
          
            </div>

              :
        <div className="special-quote">
                <div className="special-learn">Ancora imparo</div>
                <div>"Ainda estou a aprender"<br></br> - Miguelângelo aos 87 anos</div>
              {/*} <h3><Link to={`/blog/${getUltimoPost.ultimoPostId}`}> A minha última publicação: {`/blogs/${getUltimoPost.ultimoPostId}`}</Link> </h3>*/}
               </div>
          }
 </div>);
}


export default MobileLandingPage;