import api from '../../../api/axios';

export const getProducts = async (page = 1, limit = 10) => {
    const response = await api.get('/products', {
        params: { page, limit },
    });
    return response.data.data; // Unwrapping ApiResponse.data
};

export const createProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data.data; // Unwrapping ApiResponse.data
};
