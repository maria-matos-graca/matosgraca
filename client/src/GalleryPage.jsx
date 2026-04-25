import Gallery from "./components/Gallery.jsx"

const GalleryPage = ({English}) => {
    return (
       <div className="project-card">
            <Gallery English = {English} />
            </div>
    );
}
export default GalleryPage;