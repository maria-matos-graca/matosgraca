import Gallery from "./components/Gallery.jsx"

const GalleryPage = ({English}) => {
    return (
       <div className="project-card-gallery">
            <Gallery English = {English} />
            </div>
    );
}
export default GalleryPage;