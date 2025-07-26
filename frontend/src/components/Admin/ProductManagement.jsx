import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";

const ProductManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading, error } = useSelector((state) => state.adminProducts);

    const [searchTerm, setSearchTerm] = useState("");

    useLayoutEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure, you want to delete this product?")) {
            dispatch(deleteProduct(id));
        }
    };

    // Filter logic
    const filteredProducts = products.filter((product) => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
            product.name?.toLowerCase().includes(lowerSearch) ||
            product.price?.toString().includes(lowerSearch) ||
            product.gender?.toLowerCase().includes(lowerSearch) ||
            product.category?.toLowerCase().includes(lowerSearch) ||
            product.description?.toLowerCase().includes(lowerSearch)
        );
    });

    if (loading) return <p>Loading ...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className='text-2xl font-bold mb-6'>Product Management</h2>

            {/* Searchbar */}
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by name, price, gender, category, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 w-full max-w-md rounded mr-4"
                />
                {/* 👇 Add this to show total product count */}
                <div className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Total Products: {filteredProducts.length}
                </div>
                {/* Create new Product */}
                <button
                    onClick={() => navigate("/admin/products/new")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Create New Product
                </button>
            </div>

            {/* Products Table */}
            <div className='overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='min-w-full text-left text-gray-500'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className='py-3 px-4'>Name</th>
                            <th className='py-3 px-4'>Price</th>
                            <th className='py-3 px-4'>SKU</th>
                            <th className='py-3 px-4'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr
                                    key={product._id}
                                    className='border-b hover:bg-gray-50 cursor-pointer'
                                >
                                    <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>
                                        {product.name}
                                    </td>
                                    <td className='p-4'>${product.price}</td>
                                    <td className='p-4'>{product.sku}</td>
                                    <td className='p-4'>
                                        <Link
                                            to={`/admin/products/${product._id}/edit`}
                                            className='bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600'
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className='p-4 text-center text-gray-500'>
                                    No Products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagement;
