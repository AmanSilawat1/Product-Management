import React, { useReducer } from 'react';
import ProductTable from './features/products/components/ProductTable';
import ProductForm from './features/products/components/ProductForm';
import Modal from './components/Modal/Modal';
import './App.css';

const initialState = {
  view: 'table', // Always showing table now, form is in modal
  productToEdit: null,
  isModalOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { ...state, isModalOpen: true, productToEdit: action.payload || null };
    case 'CLOSE_MODAL':
      return { ...state, isModalOpen: false, productToEdit: null };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleEdit = (product) => {
    dispatch({ type: 'OPEN_MODAL', payload: product });
  };

  const handleCloseModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleAddProduct = () => {
    dispatch({ type: 'OPEN_MODAL' });
  };

  return (
    <div className="app-container">
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
        </nav>
      </header>

      <main className="app-content">
        <ProductTable onEdit={handleEdit} />

        <Modal
          isOpen={state.isModalOpen}
          onClose={handleCloseModal}
          title={state.productToEdit ? 'Edit Product' : 'Add New Product'}
        >
          <ProductForm productToEdit={state.productToEdit} onCancel={handleCloseModal} />
        </Modal>
      </main>
    </div>
  );
}

export default App;
