import { useState, useEffect } from 'react';

export default function Images() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const loadImages = async () => {
            const imageList = [];
            let index = 1;
            let hasMore = true;

            while (hasMore) {
                try {
                    const module = await import(`./assets/${index}.jpg`);
                    imageList.push({
                        id: index,
                        src: module.default,
                    });
                    index++;
                } catch {
                    hasMore = false;
                }
            }

            setImages(imageList);
        };

        loadImages();
    }, []);

    return (
        <div className="gallery">
            {images.map((image) => (
                <img 
                    key={image.id} 
                    src={image.src} 
                    alt={`Gallery ${image.id}`}
                    style={{ width: '100%', height: 'auto', objectFit: 'cover',
                        border: '4px solid var(--void-black)',
                        boxSizing: 'border-box'
                     }}
                />
            ))}
        </div>
    );
}