import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../schemas/productSchema';
import { useCreateProduct } from '../hooks/useCreateProduct';

const ProductForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            price: 0,
            description: '',
            category: '',
        },
    });

    const { mutate, isLoading } = useCreateProduct();

    const onSubmit = (data) => {
        mutate(data, {
            onSuccess: () => {
                reset();
                alert('Product created successfully!');
            },
            onError: (error) => {
                alert(`Error creating product: ${error.message}`);
            },
        });
    };

    return (
        <div className="product-form-container">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="product-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" {...register('name')} placeholder="Product Name" />
                    {errors.name && <span className="error">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input id="price" type="number" step="0.01" {...register('price')} placeholder="0.00" />
                    {errors.price && <span className="error">{errors.price.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input id="category" {...register('category')} placeholder="Category" />
                    {errors.category && <span className="error">{errors.category.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" {...register('description')} placeholder="Description (optional)" />
                    {errors.description && <span className="error">{errors.description.message}</span>}
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
