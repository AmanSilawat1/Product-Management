import React, { useReducer } from 'react';
import ProductTable from './features/products/components/ProductTable';
import ProductForm from './features/products/components/ProductForm';
import ProductDetail from './features/products/components/ProductDetail';
import Modal from './components/Modal/Modal';
import { Toaster } from 'react-hot-toast';
import './App.css';

const initialState = {
  view: 'table',
  productToEdit: null,
  isModalOpen: false,
  modalMode: 'edit', // 'edit' or 'view'
};

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        isModalOpen: true,
        productToEdit: action.payload.product || null,
        modalMode: action.payload.mode || 'edit'
      };
    case 'SWITCH_TO_EDIT':
      return {
        ...state,
        modalMode: 'edit'
      };
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false, productToEdit: null };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleEdit = (product, mode = 'edit') => {
    dispatch({ type: 'OPEN_MODAL', payload: { product, mode } });
  };

  const handleSwitchToEdit = () => {
    dispatch({ type: 'SWITCH_TO_EDIT' });
  };

  const handleCloseModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleAddProduct = () => {
    dispatch({ type: 'OPEN_MODAL', payload: { mode: 'edit' } });
  };

  const getModalTitle = () => {
    if (state.modalMode === 'view') return 'Product Details';
    return state.productToEdit ? 'Edit Product' : 'Add New Product';
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" reverseOrder={false} />
      <header className="app-header">
        <h1>Product Management</h1>
        <nav>
          <button
            className="active"
            onClick={handleCloseModal}
          >
            All Products
          </button>
          <button
            onClick={handleAddProduct}
          >
            Add Product
          </button>
          <button
            onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/customers/export`, '_blank')}
            className="export-btn"
          >
            Export Customers
          </button>
        </nav>
      </header>

      <main className="app-content">
        <ProductTable onEdit={handleEdit} />

        <Modal
          isOpen={state.isModalOpen}
          onClose={handleCloseModal}
          title={getModalTitle()}
        >
          {state.modalMode === 'view' ? (
            <ProductDetail
              product={state.productToEdit}
              onEdit={handleSwitchToEdit}
              onDelete={handleCloseModal}
              onCancel={handleCloseModal}
            />
          ) : (
            <ProductForm productToEdit={state.productToEdit} onCancel={handleCloseModal} />
          )}
        </Modal>
      </main>
    </div>
  );
}

export default App;
