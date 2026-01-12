import React from 'react'
import CarCardSkeleton from '@/modals/cards/CarCardSkeleton'

function RelatedCarsSkeleton() {
    return (
        <div className='w-full'>
            <div className='max-w-7xl mx-auto w-full flex flex-col justify-start items-center gap-12 py-12 px-4 sm:px-6 lg:px-8'>

                {/* Header Skeleton */}
                <div className='flex flex-col justify-start items-center gap-4 w-full'>
                    <div className='h-16 w-64 md:w-96 bg-gray-200 rounded animate-pulse'></div>
                    <div className='h-6 w-48 md:w-72 bg-gray-200 rounded animate-pulse'></div>
                </div>

                {/* Grid Skeleton */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-full">
                            <CarCardSkeleton />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default RelatedCarsSkeleton
