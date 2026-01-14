import React from 'react';

export default function CarCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col">
            {/* Image Skeleton */}
            <div className="aspect-[4/3] w-full bg-gray-200 animate-pulse relative">
                <div className="absolute top-4 left-4 h-6 w-20 bg-gray-300 rounded-full"></div>
            </div>

            {/* Content Skeleton */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="h-3 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="text-right">
                        <div className="h-3 w-16 bg-gray-200 rounded mb-1 ml-auto animate-pulse"></div>
                        <div className="h-6 w-24 bg-gray-200 rounded ml-auto animate-pulse"></div>
                    </div>
                </div>

                {/* Specs Grid Skeleton */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 my-4 py-4 border-t border-b border-gray-100">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto">
                    <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
