import { z } from 'zod';

export const productSchema = z.object({
    title: z.string().min(1, 'Title is required'),

    description: z.string().optional(),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    totalPrice: z.coerce.number().min(0, 'Total price must be a positive number'),
    totalDiscount: z.coerce.number().min(0, 'Total discount must be positive'),
});

/**
 * @typedef {z.infer<typeof productSchema>} Product
 */
