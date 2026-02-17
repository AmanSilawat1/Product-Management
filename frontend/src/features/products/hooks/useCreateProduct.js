import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../services/productService';

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            // Invalidate and refetch products query on success
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
