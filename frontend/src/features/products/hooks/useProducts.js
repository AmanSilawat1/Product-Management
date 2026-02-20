import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/productService';

export const useProducts = (page = 1, limit = 10, filter = '') => {
    return useQuery({
        queryKey: ['products', page, limit, filter],
        queryFn: () => getProducts(page, limit, filter),
        keepPreviousData: true,
    });
};
