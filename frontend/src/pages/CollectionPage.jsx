import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOption from '../components/Products/SortOption';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';

const CollectionPage = () => {
    const  { collection } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const {products, loading, error } = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams]);

    const SidebarRef = useRef(null);
    const buttonRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchProductsByFilters({collection, ...queryParams }));
    }, [dispatch, collection, searchParams]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (e) => {
        if (
            SidebarRef.current &&
            !SidebarRef.current.contains(e.target) 
            // &&
            // buttonRef.current &&
            // !buttonRef.current.contains(e.target)
        ) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className='flex flex-col lg:flex-row'>
            {/* Mobile Filter button */}
            <button
                ref={buttonRef}
                onClick={toggleSidebar}
                className='lg:hidden border p-2 flex justify-center items-center'>
                <FaFilter className='mr-2' /> Filters
            </button>

            {/* Filter Sidebar */}
            <div ref={SidebarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
                <FilterSidebar />
            </div>
            <div className='flex-frow p-4'>
                <h2 className='text--2xl uppercase mb-4'>All Collections</h2>
                {/* sort Option */}
                <SortOption/>

                {/* Product Grid */}
                <ProductGrid products = {products} loading={loading} error={error} />
            </div>

        </div>
    )
}

export default CollectionPage