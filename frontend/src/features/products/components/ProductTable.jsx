import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useProducts } from '../hooks/useProducts';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import { useDebounce } from '../../../hooks/useDebounce';
import { toast } from 'react-hot-toast';
import './ProductTable.css';


const ProductTable = ({ onEdit }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState([]);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const sortField = sorting.length > 0 ? sorting[0].id : '';
    const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'DESC' : 'ASC') : 'ASC';

    const { data, isLoading, isError, error } = useProducts(page, 10, debouncedSearchTerm, sortField, sortOrder);
    const deleteMutation = useDeleteProduct();

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    toast.success('Product deleted successfully');
                },
                onError: (error) => {
                    toast.error(`Error deleting product: ${error.message}`);
                }
            });
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                enableSorting: true,
                cell: ({ getValue }) => <span className="id-column">{getValue()}</span>,
            },
            {
                accessorKey: 'title',
                header: 'Name',
            },
            {
                accessorKey: 'totalPrice',
                header: 'Price',
                cell: ({ getValue }) =>
                    new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                    }).format(getValue()),
            },
            {
                accessorKey: 'quantity',
                header: 'Quantity',
            },
            {
                accessorKey: 'totalDiscount',
                header: 'Discount',
                cell: ({ getValue }) =>
                    new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                    }).format(getValue()),
            },
            {
                accessorKey: 'description',
                header: 'Description',
                cell: ({ getValue }) => <div className="description-cell">{getValue() || '-'}</div>,
            },
            {
                id: 'actions',
                header: 'Actions',
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="actions-cell">
                        <button onClick={() => onEdit(row.original, 'view')} className="view-btn">View</button>
                        <button onClick={() => onEdit(row.original, 'edit')} className="edit-btn">Edit</button>
                        <button onClick={() => handleDelete(row.original.id)} className="delete-btn">Delete</button>
                    </div>
                ),
            },
        ],
        [onEdit]
    );


    const table = useReactTable({
        data: data?.items || [],
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true, // Server-side sorting
        manualPagination: true,
    });

    if (isLoading) return <div>Loading products...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const meta = data?.meta || {};

    return (
        <div className="product-table-container">
            <div className="table-header">
                <h2>Product List</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>
            </div>
            <table className="product-table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {{
                                        asc: ' 🔼',
                                        desc: ' 🔽',
                                    }[header.column.getIsSorted()] || null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {table.getRowModel().rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center' }}>No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {meta.totalPages > 1 && (
                <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
                    <span>Page {page} of {meta.totalPages}</span>
                    <button disabled={page === meta.totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
            )}
        </div>
    );
};

export default ProductTable;

