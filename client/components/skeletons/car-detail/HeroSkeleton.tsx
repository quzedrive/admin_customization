import React from 'react';

export default function HeroSkeleton() {
    return (
        <section className="max-w-[1920px] mx-auto px-[5.4%] py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

                {/* Left Column: Image Skeleton */}
                <div className="flex flex-col-reverse md:flex-row gap-4 h-fit">
                    {/* Thumbnails */}
                    <div className="flex md:flex-col gap-4 overflow-hidden md:w-24 flex-shrink-0">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-24 h-20 md:w-20 md:h-16 bg-gray-200 rounded-lg animate-pulse" />
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="relative flex-1 aspect-[4/3] w-full rounded-2xl bg-gray-200 animate-pulse" />
                </div>

                {/* Right Column: Details Skeleton */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        {/* Title */}
                        <div className="h-10 w-3/4 bg-gray-200 rounded-lg mb-4 animate-pulse" />

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
                            ))}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Packages Card Skeleton */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mt-auto">
                        {/* Selected Package Header */}
                        <div className="h-7 w-2/3 bg-gray-200 rounded mb-6 animate-pulse" />

                        {/* Package Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="min-h-[100px] bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col justify-between">
                                    <div className="flex justify-between mb-2">
                                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                                        <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                                    </div>
                                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-auto" />
                                </div>
                            ))}
                        </div>

                        {/* Additional Info */}
                        <div className="h-4 w-1/2 bg-gray-200 rounded mb-6 animate-pulse" />

                        {/* Button */}
                        <div className="w-full h-14 bg-gray-200 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        </section>
    );
}
