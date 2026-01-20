'use client';
import { useCarQueries } from '@/lib/hooks/queries/useCarQueries';
import CarCard from '@/modals/cards/CarCard';
import { Loader2 } from 'lucide-react';
import CarCardSkeleton from './skeletons/CarCardSkeleton';
import Link from 'next/link';

export default function Collection() {
    const { useGetFeaturedCars } = useCarQueries();
    const { data: cars, isLoading, isError } = useGetFeaturedCars();

    const renderSkeletons = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
                <CarCardSkeleton key={i} />
            ))}
        </div>
    );

    if (isLoading) {
        return (
            <section id='tariffs' className="w-full flex flex-col justify-center items-center py-16 gap-12 bg-gray-50/50">
                <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Our Premium Fleet
                        </h2>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto animate-pulse" />
                    </div>
                    {renderSkeletons()}
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="w-full flex justify-center py-20 text-red-500">
                Failed to load cars. Please try again later.
            </section>
        );
    }

    // Ensure we have an array to map (handle pagination response structure)
    const carList = cars?.cars || (Array.isArray(cars) ? cars : []);

    return (
        <section id='tariffs' className="w-full flex flex-col justify-center items-center py-16 gap-12 bg-gray-50/50">
            <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 space-y-12">

                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Our Premium Fleet
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600">
                        Choose from our wide range of well-maintained vehicles for your consistent and comfortable journey.
                    </p>
                </div>

                {carList.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No cars available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {carList.map((car: any) => (
                            <CarCard key={car._id} car={car} />
                        ))}
                    </div>
                )}

                <div className='w-full flex justify-center items-center'>
                    <Link href='/our-fleet' className='bg-[#BFA06A] !text-white px-6 py-3 rounded-full hover:bg-[#a88b58] hover:scale-105 transition-all duration-300 cursor-pointer'>
                        View More
                    </Link>
                </div>

            </div>
        </section>
    );
}
