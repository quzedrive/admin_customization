'use client'

import React, { useEffect } from 'react'
import TopBar from './sections/TopBar'
import { useCarQueries } from '@/lib/hooks/queries/useCarQueries'
import HeroSkeleton from '../skeletons/car-detail/HeroSkeleton';
import SpecificationsSkeleton from '../skeletons/car-detail/SpecificationsSkeleton';
import RelatedCarsSkeleton from '../skeletons/car-detail/RelatedCarsSkeleton';
import Hero from './sections/Hero';
import Specifications from './sections/Specifications';
import Cta from './sections/Cta';
import Faqs from './sections/Faqs';
import RelatedCars from './sections/RelatedCars';

function CarDetailLayout({ detail }: { detail: string }) {
    const { useGetCarBySlug } = useCarQueries();
    const { data: car, isLoading, error } = useGetCarBySlug(detail);

    // For debugging/verification
    useEffect(() => {
        if (car) console.log('Car Data Fetched:', car);
        if (error) console.error('Error Fetching Car:', error);
    }, [car, error]);


    if (!isLoading && (error || !car)) return (
        <div className='pt-28 min-h-screen flex items-center justify-center flex-col'>
            <TopBar />
            <div className="text-center py-20 text-gray-500">
                <h2 className="text-2xl font-bold mb-2">Car Not Found</h2>
                <p>The car you are looking for does not exist or has been removed.</p>
            </div>
        </div>
    );

    return (
        <div className='pt-28'>
            <TopBar carName={car?.name} />
            {isLoading ? <HeroSkeleton /> : <Hero car={car} />}
            {isLoading ? <SpecificationsSkeleton /> : <Specifications specifications={car?.specifications} isLoading={isLoading} />}
            <Cta />
            <Faqs />
            {isLoading ? <RelatedCarsSkeleton /> : (car && <RelatedCars currentCarId={car._id} type={car.type} />)}
        </div>
    )
}

export default CarDetailLayout