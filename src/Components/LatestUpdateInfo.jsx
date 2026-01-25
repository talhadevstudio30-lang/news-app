import React, { useState } from 'react'

function LatestUpdateInfo({ category_name }) {
    // {categories.find(item => item.id === category)?.label || "General"}
    return (
        <>
            <div className='bg-[#F1F5F9] flex justify-between py-6.5 px-2.5 sm:px-8.5 flex-wrap  items-center'>
                <div className='flex justify-center items-center font-semibold flex-wrap'>
                    <h1 className='text-[20px] sm:text-[24.5px] md:text-[29px]'>Latest News</h1><div className='h-1.5 md:h-2.5 md:w-2.5 w-1.5 bg-gray-400 rounded-full mr-3 ml-3 mt-1 border-2 border-gray-400'></div>
                    <h1 className='text-[20px] sm:text-[25.6px] md:text-[29px] text-blue-500'>{category_name}</h1>
                </div>
                <div className='flex justify-center items-center ml-2'><div className='h-1.5 md:h-2.5 md:w-2.5 w-1.5 mt-0.5 bg-green-500 rounded-full mr-2 ml-2 border-2 border-green-500'></div><h1 className='text-[16px] text-gray-500 sm:text-[19px] md:text-[22px]'>Live Updates</h1></div>
            </div>
        </>
    )
}

export default LatestUpdateInfo
