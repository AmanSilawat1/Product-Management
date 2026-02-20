import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct } from '../hooks/useDeleteProduct';

const ProductTable = ({ onEdit }) => {
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const { data, isLoading, isError, error } = useProducts(page, 10, filter);
    const deleteMutation = useDeleteProduct();

    const handleSearchChange = (e) => {
        setFilter(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    alert('Product deleted successfully');
                },
                onError: (error) => {
                    alert(`Error deleting product: ${error.message}`);
                }
            });
        }
    };

    if (isLoading) return <div>Loading products...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const products = data?.items || [];
    const meta = data?.meta || {};

    return (
        <div className="product-table-container">
            <div className="table-header">
                <h2>Product List</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={filter}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>
            </div>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Discount</th>
                        <th>Description</th>
                        <th>Actions</th>
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
                            <td className="actions-cell">
                                <button onClick={() => onEdit(product)} className="edit-btn">Edit</button>
                                <button onClick={() => handleDelete(product.id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {meta.totalPages > 1 && (
                <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                    <span>Page {page} of {meta.totalPages}</span>
                    <button disabled={page === meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
