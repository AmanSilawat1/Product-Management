import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.coerce.number().min(0, 'Price must be a positive number'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
});

/**
 * @typedef {z.infer<typeof productSchema>} Product
 */
