import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/productService';

export const useProducts = (page = 1, limit = 10, filter = '', sort = '', order = 'ASC') => {
    return useQuery({
        queryKey: ['products', page, limit, filter, sort, order],
        queryFn: () => getProducts(page, limit, filter, sort, order),
        placeholderData: (previousData) => previousData,
    });
};

