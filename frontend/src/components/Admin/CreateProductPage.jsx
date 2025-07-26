import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createProduct } from '../../redux/slices/adminProductSlice';

const CreateProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: [],
        isPublished: false,
        isFeatured: false,
    });

    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/uploads`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, { url: data.imageUrl, altText: "" }],
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Set default gender if not provided
        const finalData = {
            ...productData,
            gender: productData.gender || "Unisex",
        };

        dispatch(createProduct(finalData));
        navigate("/admin/products");
    };

    return (
        <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
            <h2 className='text-3xl font-bold mb-6'>Create New Product</h2>
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Product Name</label>
                    <input
                        type="text"
                        name='name'
                        value={productData.name}
                        onChange={handleChange}
                        className='w-full border border-gray-500 rounded-md p-2'
                        required
                    />
                </div>

                {/* Description */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Description</label>
                    <textarea
                        name='description'
                        value={productData.description}
                        onChange={handleChange}
                        className='w-full border border-gray-500 rounded-md p-2'
                        rows={4}
                        required
                    />
                </div>

                {/* Price */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Price</label>
                    <input
                        type='number'
                        name='price'
                        value={productData.price}
                        onChange={handleChange}
                        className='w-full border border-gray-500 rounded-md p-2'
                        required
                    />
                </div>

                {/* Stock */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Count In Stock</label>
                    <input
                        type='number'
                        name='countInStock'
                        value={productData.countInStock}
                        onChange={handleChange}
                        className='w-full border border-gray-500 rounded-md p-2'
                        required
                    />
                </div>

                {/* SKU */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>SKU</label>
                    <input
                        type='text'
                        name='sku'
                        value={productData.sku}
                        onChange={handleChange}
                        className='w-full border border-gray-500 rounded-md p-2'
                        required
                    />
                </div>

                {/* Sizes */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Sizes (comma-separated)</label>
                    <input
                        type='text'
                        name='sizes'
                        value={productData.sizes.join(', ')}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                sizes: e.target.value.split(',').map((s) => s.trim()),
                            })
                        }
                        className='w-full border border-gray-500 rounded-md p-2'
                    />
                </div>

                {/* Colors */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Colors (comma-separated)</label>
                    <input
                        type='text'
                        name='colors'
                        value={productData.colors.join(', ')}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                colors: e.target.value.split(',').map((c) => c.trim()),
                            })
                        }
                        className='w-full border border-gray-500 rounded-md p-2'
                    />
                </div>

                {/* Image upload */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Upload Image</label>
                    <input
                        type='file'
                        onChange={handleImageUpload}
                        className='file:mr-4 file:py-2 file:px-4 file:bg-gray-200 file:text-gray-900 hover:file:bg-gray-300'
                    />
                    {uploading && <p>Uploading image...</p>}
                    <div className='flex gap-4 mt-4'>
                        {productData.images.map((image, index) => (
                            <div key={index}>
                                <img
                                    src={image.url}
                                    alt={image.altText || 'Product'}
                                    className='w-20 h-20 object-cover rounded-md shadow-md'
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Category</label>
                    <input
                        type='text'
                        name='category'
                        value={productData.category}
                        onChange={handleChange}
                        className='w-full border border-gray-500 rounded-md p-2'
                        required
                    />
                </div>

                {/* Collection */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Collection</label>
                    <input
                        type='text'
                        name='collections'
                        value={productData.collections}
                        onChange={handleChange}
                        className='w-full border border-gray-500 rounded-md p-2'
                        required
                    />
                </div>

                {/* Gender */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Gender</label>
                    <select
                        name='gender'
                        value={productData.gender}
                        onChange={handleChange}
                        className='w-full border border-gray-500 rounded-md p-2'
                    >
                        <option value="">Select Gender</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                </div>

                {/* Is Published */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Published</label>
                    <select
                        name='isPublished'
                        value={productData.isPublished}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                isPublished: e.target.value === "true",
                            })
                        }
                        className='w-full border border-gray-500 rounded-md p-2'
                    >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                </div>

                {/* Is Featured */}
                <div className='mb-6'>
                    <label className='block font-semibold mb-2'>Featured</label>
                    <select
                        name='isFeatured'
                        value={productData.isFeatured}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                isFeatured: e.target.value === "true",
                            })
                        }
                        className='w-full border border-gray-500 rounded-md p-2'
                    >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                </div>

                <button
                    type='submit'
                    className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors'
                >
                    Create Product
                </button>
            </form>
        </div>
    );
};

export default CreateProductPage;
