import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../services/productService';

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, productData }) => updateProduct(id, productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
