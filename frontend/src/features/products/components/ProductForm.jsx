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
            orderId: '',
            title: '',
            description: '',
            quantity: 1,
            totalPrice: 0,
            totalDiscount: 0,
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
                alert(`Error creating product: ${error.response?.data?.message || error.message}`);
            },
        });
    };

    return (
        <div className="product-form-container">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="product-form">
                <div className="form-group">
                    <label htmlFor="orderId">Order ID</label>
                    <input id="orderId" type="number" {...register('orderId')} placeholder="1" />
                    {errors.orderId && <span className="error">{errors.orderId.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input id="title" {...register('title')} placeholder="Product Title" />
                    {errors.title && <span className="error">{errors.title.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <textarea id="description" {...register('description')} placeholder="Description" />
                    {errors.description && <span className="error">{errors.description.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input id="quantity" type="number" {...register('quantity')} placeholder="1" />
                    {errors.quantity && <span className="error">{errors.quantity.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="totalPrice">Total Price</label>
                    <input id="totalPrice" type="number" step="0.01" {...register('totalPrice')} placeholder="0.00" />
                    {errors.totalPrice && <span className="error">{errors.totalPrice.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="totalDiscount">Total Discount</label>
                    <input id="totalDiscount" type="number" step="0.01" {...register('totalDiscount')} placeholder="0.00" />
                    {errors.totalDiscount && <span className="error">{errors.totalDiscount.message}</span>}
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
