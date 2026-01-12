import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Fuel, Gauge, Users } from 'lucide-react';

interface CarCardProps {
    car: any; // Using any for now to match the flexible backend response, can be strictly typed later
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
    // Default fallback image if none provided
    const imageUrl = car.images?.[0]?.url || '/cars/default-car.webp';

    return (
        <Link href={`/${car.slug}`} className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
            {/* Image Container */}
            <div className="relative aspect-[4/2] bg-gray-50 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={car.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Title & Price */}
                <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {car.name}
                    </h3>
                    <div className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                            {car.type}
                        </span>
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 py-3 border-t border-b border-gray-50">
                    <div className="flex items-center gap-1.5" title="Transmission">
                        <Gauge size={16} className="text-gray-400" />
                        <span className="font-medium text-xs">{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Fuel Type">
                        <Fuel size={16} className="text-gray-400" />
                        <span className="font-medium text-xs">{car.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Capacity">
                        <Users size={16} className="text-gray-400" />
                        <span className="font-medium text-xs">{car.seatingCapacity} Seat</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm line-clamp-2 mb-5 flex-grow">
                    {car.description || `Experience the comfort and performance of the ${car.name}. Perfect for your next journey.`}
                </p>

                {/* Footer Action */}
                <div className="mt-auto pt-2">
                    <div
                        className="block w-full text-center bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 hover:shadow-none translate-y-0 hover:translate-y-0.5 active:translate-y-0 text-sm uppercase tracking-wide"
                    >
                        Check Availability
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CarCard;