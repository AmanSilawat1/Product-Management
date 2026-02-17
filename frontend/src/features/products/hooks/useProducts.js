import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/productService';

export const useProducts = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['products', page, limit],
        queryFn: () => getProducts(page, limit),
        keepPreviousData: true,
    });
};
