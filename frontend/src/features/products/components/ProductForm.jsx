
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../schemas/productSchema';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { useUpdateProduct } from '../hooks/useUpdateProduct';

const ProductForm = ({ productToEdit, onCancel }) => {
    const isEditMode = !!productToEdit;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: productToEdit?.title || '',
            description: productToEdit?.description || '',
            quantity: productToEdit?.quantity || 1,
            totalPrice: productToEdit?.totalPrice || 0,
            totalDiscount: productToEdit?.totalDiscount || 0,
        },

    });

    useEffect(() => {
        if (productToEdit) {
            reset({
                title: productToEdit?.title || '',
                description: productToEdit?.description || '',
                quantity: productToEdit?.quantity || 1,
                totalPrice: productToEdit?.totalPrice || 0,
                totalDiscount: productToEdit?.totalDiscount || 0,
            });
        } else {
            reset({
                title: '',
                description: '',
                quantity: 1,
                totalPrice: 0,
                totalDiscount: 0,
            });
        }

    }, [productToEdit, reset]);

    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();

    const isLoading = createMutation.isLoading || updateMutation.isLoading;

    const onSubmit = (data) => {
        if (isEditMode) {
            updateMutation.mutate(
                { id: productToEdit.id, productData: data },
                {
                    onSuccess: () => {
                        alert('Product updated successfully!');
                        if (onCancel) onCancel();
                    },
                    onError: (error) => {
                        alert(`Error updating product: ${error.response?.data?.message || error.message}`);
                    },
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    reset();
                    alert('Product created successfully!');
                },
                onError: (error) => {
                    alert(`Error creating product: ${error.response?.data?.message || error.message}`);
                },
            });
        }
    };

    return (
        <div className="product-form-container">
            <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="product-form">

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

                <div className="form-actions">
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
                    </button>
                    {isEditMode && (
                        <button type="button" onClick={onCancel} className="cancel-btn">
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
