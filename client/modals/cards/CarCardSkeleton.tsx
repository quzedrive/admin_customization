import React from 'react';

const CarCardSkeleton = () => {
    return (
        <div className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden h-full">
            {/* Image Container Skeleton */}
            <div className="relative aspect-[4/3] bg-gray-200 animate-pulse" />

            {/* Content Skeleton */}
            <div className="p-5 flex flex-col flex-grow space-y-4">
                {/* Title & Badge */}
                <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded-md w-1/4 animate-pulse" />
                </div>

                {/* Specs Grid */}
                <div className="flex items-center gap-4 py-3 border-t border-b border-gray-50">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                </div>

                {/* Description */}
                <div className="space-y-2 flex-grow">
                    <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>

                {/* Button */}
                <div className="mt-auto pt-2">
                    <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default CarCardSkeleton;
