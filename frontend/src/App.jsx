import React, { useReducer } from 'react';
import ProductTable from './features/products/components/ProductTable';
import ProductForm from './features/products/components/ProductForm';
import './App.css';

const initialState = {
  view: 'table', // 'table' or 'form'
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Product Management</h1>
        <nav>
          <button
            className={state.view === 'table' ? 'active' : ''}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'table' })}
          >
            All Products
          </button>
          <button
            className={state.view === 'form' ? 'active' : ''}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'form' })}
          >
            Add Product
          </button>
        </nav>
      </header>

      <main className="app-content">
        {state.view === 'table' ? <ProductTable /> : <ProductForm />}
      </main>
    </div>
  );
}

export default App;
