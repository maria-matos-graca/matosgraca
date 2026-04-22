// frontend/src/services/GalleryService.js
import api from './auth';

const GalleryService = {
    uploadImage: async (formData) => {
        const response = await api.post('/gallery/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    
    getImages: async (params) => {
        const response = await api.get('/gallery', { params });
        return response.data;
    },
    
    getImageById: async (id) => {
        const response = await api.get(`/gallery/${id}`);
        return response.data;
    },
    
    updateImage: async (id, data) => {
        const response = await api.put(`/gallery/${id}`, data);
        return response.data;
    },
    
    deleteImage: async (id) => {
        const response = await api.delete(`/gallery/${id}`);
        return response.data;
    }
};

export default GalleryService;