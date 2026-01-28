'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fuel, Gauge, Settings, Users, ArrowRight } from 'lucide-react';

interface CarCardProps {
    car: any;
}

export default function CarCard({ car }: CarCardProps) {
    // Helper to get lowest package price or base price
    const getStartingPrice = () => {
        if (car.packages && car.packages.length > 0) {
            // Find lowest ACTIVE package price
            const prices = car.packages
                .filter((p: any) => p.isActive !== false)
                .map((p: any) => p.price);
            if (prices.length > 0) return Math.min(...prices);
        }
        return car.basePrice || car.hourlyCharge || 0;
    };

    const startingPrice = getStartingPrice();

    return (
        <Link href={`/${car.slug}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-[5/3] w-full overflow-hidden bg-gray-50">
                {car.images && car.images.length > 0 ? (
                    <Image
                        src={car.images[0].url || car.images[0]}
                        alt={car.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-300 bg-gray-100">
                        No Image
                    </div>
                )}

                {/* Brand Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm uppercase tracking-wider">
                    {car.type}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-0">
                    <div>
                        <p className="text-xs text-green-600 font-bold tracking-wide uppercase mb-0">{car.brand}</p>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{car.name}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0">STARTING AT</p>
                        <p className="text-lg font-black text-gray-900">₹{startingPrice.toLocaleString()}</p>
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 my-0 py-4 border-t border-b border-gray-50">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Settings size={14} className="text-blue-500" />
                        <span className="text-xs font-semibold">{car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Fuel size={14} className="text-blue-500" />
                        <span className="text-xs font-semibold">{car.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Users size={14} className="text-blue-500" />
                        <span className="text-xs font-semibold">{car.seatingCapacity} Seats</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Gauge size={14} className="text-blue-500" />
                        <span className="text-xs font-semibold">Fast</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="flex items-center justify-center gap-2 w-full secondary-btn text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all group-hover:translate-y-0">
                        View Details
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </Link>
    );
}   