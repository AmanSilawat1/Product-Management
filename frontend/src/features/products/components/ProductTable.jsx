import React from 'react';
import { useProducts } from '../hooks/useProducts';

const ProductTable = () => {
    const { data, isLoading, isError, error } = useProducts();

    if (isLoading) return <div>Loading products...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const products = data?.data || [];

    return (
        <div className="product-table-container">
            <h2>Product List</h2>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.description}</td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
