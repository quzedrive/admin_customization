import React from 'react'

function SpecificationsSkeleton() {
    return (
        <div className='bg-black w-full py-16 px-4'>
            <div className='max-w-7xl mx-auto w-full flex flex-col justify-start items-center gap-12'>

                {/* Header Skeleton */}
                <div className='flex flex-col justify-start items-center gap-4 w-full'>
                    <div className='h-4 w-32 bg-[#373636] rounded animate-pulse'></div>
                    <div className='h-10 w-64 md:w-96 bg-[#373636] rounded animate-pulse'></div>
                    <div className='h-4 w-full max-w-2xl bg-[#373636] rounded animate-pulse'></div>
                    <div className='h-4 w-2/3 max-w-xl bg-[#373636] rounded animate-pulse'></div>
                </div>

                {/* Grid Skeleton */}
                <div className='flex flex-wrap gap-10 w-full items-center justify-center'>
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div
                            key={index}
                            className='h-28 w-28 border border-[#373636] rounded-md flex flex-col items-center justify-center p-3'
                        >
                            <div className='h-8 w-8 bg-[#373636] rounded-full animate-pulse mb-3'></div>
                            <div className='h-3 w-16 bg-[#373636] rounded animate-pulse'></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SpecificationsSkeleton
