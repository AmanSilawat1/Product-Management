import React from 'react';
import './ProductDetail.css';

const ProductDetail = ({ product, onEdit, onDelete, onCancel }) => {
    if (!product) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <div className="product-detail">
            <div className="detail-section">
                <div className="section-header">
                    <h4 className="left-align">Product Information</h4>
                    <div className="header-actions">
                        <button onClick={() => onEdit(product)} className="action-button edit" title="Edit Product">
                            Edit
                        </button>
                        <button onClick={() => onDelete(product.id)} className="action-button delete" title="Delete Product">
                            Delete
                        </button>
                    </div>
                </div>
                <div className="info-card">
                    <div className="title-display">
                        <span className="detail-label">Product Name</span>
                        <h2 className="product-title-view">{product.title}</h2>
                    </div>
                    <div className="metrics-grid">
                        <div className="metric-item">
                            <span className="detail-label">Quantity</span>
                            <span className="metric-value">{product.quantity}</span>
                        </div>
                        <div className="metric-item">
                            <span className="detail-label">Total Price</span>
                            <span className="metric-value primary">{formatCurrency(product.totalPrice)}</span>
                        </div>
                        <div className="metric-item">
                            <span className="detail-label">Total Discount</span>
                            <span className="metric-value error">{formatCurrency(product.totalDiscount)}</span>
                        </div>
                    </div>
                    <div className="description-display">
                        <span className="detail-label">Description</span>
                        <p className="description-text-view">{product.description || 'No description provided.'}</p>
                    </div>
                </div>
            </div>

            <div className="detail-section">
                <h4 className='left-align'>Audit Metadata</h4>
                <div className="audit-grid">
                    <div className="detail-item">
                        <span className="detail-label">Created At</span>
                        <span className="detail-value small">{formatDate(product.createdAt)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Last Updated</span>
                        <span className="detail-value small">{formatDate(product.updatedAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
