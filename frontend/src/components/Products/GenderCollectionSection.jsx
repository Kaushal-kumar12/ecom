import React from 'react'
import mensCollectionImage from '../../assets/mens-collection.webp';
import womensCollectionImage from '../../assets/womens-collection.webp';
import { Link } from 'react-router-dom';

const GenderCollectionSection = () => {
    return <section className='py-16 px-4 lg:px-0'>
        <div className='container pl-2 pr-1 mx-auto flex flex-col md:flex-row gap-8'>
            {/* womens collection */}
            <div className='relative flex-1'>
                <img
                    src={womensCollectionImage}
                    alt="women's collection"
                    className='w-full h-[700px] object-cover'
                />
                <div className='absolute bottom-8 bg-white/90 p-4'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                        Women's Collection
                    </h2>
                    <Link
                        to="/collections/all?gender=Women"
                        className='text-gray-900 underline'
                    />
                </div>
            </div>
            {/* Men's Collection */}
            <div className='relative flex-1'>
                <img
                    src={mensCollectionImage}
                    alt="women's collection"
                    className='w-full h-[700px] object-cover'
                />
                <div className='absolute bottom-8 bg-white/90 p-4'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                        Men's Collection
                    </h2>
                    <Link
                        to="/collections/all?gender=Men"
                        className='text-gray-900 underline'
                    />
                </div>
            </div>
        </div>
    </section>
}

export default GenderCollectionSection