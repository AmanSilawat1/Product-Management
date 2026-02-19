import React from 'react';
import { useProducts } from '../hooks/useProducts';

const ProductTable = () => {
    const { data, isLoading, isError, error } = useProducts();

    if (isLoading) return <div>Loading products...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const products = data?.items || [];

    return (
        <div className="product-table-container">
            <h2>Product List</h2>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Discount</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.title}</td>
                            <td>
                                {new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                }).format(product.totalPrice)}
                            </td>
                            <td>{product.quantity}</td>
                            <td>
                                {new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                }).format(product.totalDiscount)}
                            </td>
                            <td>{product.description}</td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
