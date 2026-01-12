import React, { useMemo } from 'react';
import { useCarQueries } from '@/lib/hooks/queries/useCarQueries';
import CarCard from '@/modals/cards/CarCard';
import RelatedCarsSkeleton from '@/components/skeletons/car-detail/RelatedCarsSkeleton';

interface RelatedCarsProps {
    currentCarId?: string;
    type?: string;
}

function RelatedCars({ currentCarId, type }: RelatedCarsProps) {
    const { useGetPublicCars } = useCarQueries();
    const { data: carsData, isLoading } = useGetPublicCars();

    const relatedCars = useMemo(() => {
        // Handle both array (direct response) and object (paginated/wrapped response) structures
        const carsList = Array.isArray(carsData) ? carsData : (carsData?.cars || []);

        if (!carsList.length || !type) return [];

        console.log('RelatedCars Debug:', {
            totalCars: carsList.length,
            targetType: type,
            currentId: currentCarId,
            dataType: Array.isArray(carsData) ? 'array' : 'object'
        });

        return carsList
            .filter((car: any) => {
                const typeMatch = car.type?.toLowerCase() === type?.toLowerCase();
                const idMismatch = car._id !== currentCarId;
                const statusMatch = car.status === 1;

                // Detailed log for potential matches
                if (car.type?.toLowerCase() === type?.toLowerCase()) {
                    console.log(`Car ${car.name} (${car._id}): match=${typeMatch && idMismatch && statusMatch}`, {
                        typeMatch,
                        idMismatch,
                        statusMatch
                    });
                }

                return typeMatch && idMismatch && statusMatch;
            })
            .slice(0, 3);
    }, [carsData, type, currentCarId]);

    if (isLoading) return <RelatedCarsSkeleton />;

    return (
        <div className='w-full'>
            <div className='max-w-7xl mx-auto w-full flex flex-col justify-start items-center gap-12 py-12 px-4 sm:px-6 lg:px-8'>

                <div className='flex flex-col justify-start items-center gap-2'>
                    <h2 className='text-4xl md:text-5xl lg:text-6xl font-medium leading-tight'>
                        Related Cars
                    </h2>
                    <p className='text-base md:text-lg text-gray-600 font-medium mt-2'>
                        More options to consider for your trip
                    </p>
                </div>

                {relatedCars.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
                        {relatedCars.map((car: any) => (
                            <div key={car._id} className="h-full">
                                <CarCard car={car} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No related cars available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RelatedCars;