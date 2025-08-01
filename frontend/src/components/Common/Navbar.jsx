import React, { useState } from 'react'
import logo from '../../assets/logo.png'; // Adjust path as per your project structure
import { Link, useNavigate } from 'react-router-dom'
import {
    HiOutlineUser,
    HiOutlineShoppingBag,
    HiBars3BottomRight,
} from "react-icons/hi2";
import Searchbar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const [drawerOpen, setOpenDrawer] = useState(false);
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);
    const { cart } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();


    const cartItemCount =
        cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
        0;

    const toggleNavDrawer = () => {
        setNavDrawerOpen(!navDrawerOpen);
    }

    const toggleCartDrawer = () => {
        setOpenDrawer(!drawerOpen);
    };
    return (
        <>
            <nav className='container mx-auto flex items-center justify-between py-4 px-10'>
                {/* Left-logo */}
                <div>
                    <Link to='/'>
                        <img src={logo} alt="Logo" className="h-10 w-auto" />
                    </Link>
                </div>
                {/* center navigation link */}
                <div className='hidden md:flex space-x-6'>
                    <Link to="/collections/all?gender=Men"
                        className='text-gray-700 hover:text:black text-sm font-medium uppercase'>
                        Men
                    </Link>
                    <Link to="/collections/all?gender=Women"
                        className='text-gray-700 hover:text:black text-sm font-medium uppercase'>
                        women
                    </Link>
                    <Link to="/collections/all?category=Top Wear"
                        className='text-gray-700 hover:text:black text-sm font-medium uppercase'>
                        Top wear
                    </Link>
                    <Link to="/collections/all?category=Bottom Wear"
                        className='text-gray-700 hover:text:black text-sm font-medium uppercase'>
                        Bottom wear
                    </Link>
                </div>
                {/* right-icons */}
                <div className='flex items-center space-x-4'>
                    {user && user.role === "admin" && (
                        <Link
                            to="/admin"
                            className='block bg-black px-2 rounded text-sm text-white'>
                            Admin
                        </Link>)
                    }
                    <button
                        onClick={() => {
                            if (user) {
                                navigate("/profile");
                            } else {
                                navigate("/login");
                            }
                        }}
                        className='hover:text-black'
                    >
                        <HiOutlineUser className="h-6 w-6 text-gray-700" />
                    </button>
                    <button
                        onClick={toggleCartDrawer}
                        className='relative hover:text-black'>
                        <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
                        {cartItemCount > 0 && (
                            <span className='absolute -top-1 bg-[#ea2e0e] text-white text-xs rounded-full px-2 py-0.5'>
                                {cartItemCount}
                            </span>
                        )}

                    </button>
                    {/* search */}
                    <div className='overflow-hidden'>
                        <Searchbar />
                    </div>

                    <button onClick={toggleNavDrawer} className='md:hidden'>
                        <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
                    </button>
                </div>
            </nav>
            <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

            {/* Mobile navigation */}
            <div
                className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className='flex justify-end p-4'>
                    <button onClick={toggleNavDrawer}>
                        <IoMdClose className='h-6 w-6 text-gray-600' />
                    </button>
                </div>
                <div className='p-4'>
                    <h2 className='text-xl font-semibold mb-4'>Menu</h2>
                    <nav className='space-y-4'>
                        <Link
                            to="/collections/all?gender=Men"
                            onClick={toggleNavDrawer}
                            className='block text-gray-600 hover:text-black'
                        >
                            Men
                        </Link>
                        <Link
                            to="/collections/all?gender=Women"
                            onClick={toggleNavDrawer}
                            className='block text-gray-600 hover:text-black'
                        >
                            Women
                        </Link>
                        <Link
                            to="/collections/all?category=Top Wear"
                            onClick={toggleNavDrawer}
                            className='block text-gray-600 hover:text-black'
                        >
                            Top Wear
                        </Link>
                        <Link
                            to="/collections/all?category=Bottom Wear"
                            onClick={toggleNavDrawer}
                            className='block text-gray-600 hover:text-black'
                        >
                            Bottm Wear
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Navbar