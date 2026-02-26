
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../schemas/productSchema';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { useUpdateProduct } from '../hooks/useUpdateProduct';
import { toast } from 'react-hot-toast';

const ProductForm = ({ productToEdit, onCancel }) => {
    const isEditMode = !!productToEdit;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: productToEdit?.title || '',
            description: productToEdit?.description || '',
            quantity: productToEdit?.quantity || 1,
            unitPrice: productToEdit?.totalPrice && productToEdit?.quantity ? (productToEdit.totalPrice / productToEdit.quantity) : 0,
            totalPrice: productToEdit?.totalPrice || 0,
            totalDiscount: productToEdit?.totalDiscount || 0,
        },

    });

    const quantity = watch('quantity');
    const unitPrice = watch('unitPrice');

    useEffect(() => {
        const total = (Number(quantity) || 0) * (Number(unitPrice) || 0);
        setValue('totalPrice', total);
    }, [quantity, unitPrice, setValue]);

    useEffect(() => {
        if (productToEdit) {
            reset({
                title: productToEdit?.title || '',
                description: productToEdit?.description || '',
                quantity: productToEdit?.quantity || 1,
                unitPrice: productToEdit?.totalPrice && productToEdit?.quantity ? (productToEdit.totalPrice / productToEdit.quantity) : 0,
                totalPrice: productToEdit?.totalPrice || 0,
                totalDiscount: productToEdit?.totalDiscount || 0,
            });
        } else {
            reset({
                title: '',
                description: '',
                quantity: 1,
                unitPrice: 0,
                totalPrice: 0,
                totalDiscount: 0,
            });
        }

    }, [productToEdit, reset]);

    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();

    const isLoading = createMutation.isLoading || updateMutation.isLoading;

    const onSubmit = (data) => {
        // unitPrice is not needed in backend
        const { unitPrice, ...productData } = data;

        if (isEditMode) {
            updateMutation.mutate(
                { id: productToEdit.id, productData },
                {
                    onSuccess: () => {
                        toast.success('Product updated successfully!');
                        if (onCancel) onCancel();
                    },
                    onError: (error) => {
                        toast.error(`Error updating product: ${error.response?.data?.message || error.message}`);
                    },
                }
            );
        } else {
            createMutation.mutate(productData, {
                onSuccess: () => {
                    reset();
                    toast.success('Product created successfully!');
                    if (onCancel) onCancel();
                },
                onError: (error) => {
                    toast.error(`Error creating product: ${error.response?.data?.message || error.message}`);
                },
            });
        }
    };

    return (
        <div className="product-form-container">
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

                <div className="form-group-row">
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity</label>
                        <input id="quantity" type="number" {...register('quantity')} placeholder="1" />
                        {errors.quantity && <span className="error">{errors.quantity.message}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="unitPrice">Unit Price</label>
                        <input id="unitPrice" type="number" step="0.01" {...register('unitPrice')} placeholder="0.00" />
                        {errors.unitPrice && <span className="error">{errors.unitPrice.message}</span>}
                    </div>

                </div>

                <div className="form-group">
                    <label htmlFor="totalPrice">Total Price (Quantity * Unit Price)</label>
                    <input id="totalPrice" type="number" step="0.01" {...register('totalPrice')} placeholder="0.00" disabled />
                    {errors.totalPrice && <span className="error">{errors.totalPrice.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="totalDiscount">Total Discount</label>
                    <input id="totalDiscount" type="number" step="0.01" {...register('totalDiscount')} placeholder="0.00" />
                    {errors.totalDiscount && <span className="error">{errors.totalDiscount.message}</span>}
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={isLoading} className="submit-btn">
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
