import api from '../../../api/axios';

export const getProducts = async (page = 1, limit = 10, filter = '', sort = '', order = 'ASC') => {
    const response = await api.get('/products', {
        params: { page, limit, filter, sort, order },
    });

    console.log(response);
    return response.data.data;
};

export const createProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data.data;
};

export const updateProduct = async (id, productData) => {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};
