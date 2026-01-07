
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCarQueries } from '@/lib/hooks/queries/useCarQueries';
import { ArrowLeft, CarFront, Edit, Fuel, Gauge, Users, Loader2, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CarViewPage() {
    const params = useParams();
    const router = useRouter();
    const { useGetCarById } = useCarQueries();
    const { data: car, isLoading, error } = useGetCarById(params.id as string);
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (car?.images?.[0]) {
            setSelectedImage(typeof car.images[0] === 'string' ? car.images[0] : car.images[0].url);
        }
    }, [car]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500">Loading car details...</p>
            </div>
        );
    }

    if (error || !car) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <CarFront className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Car Not Found</h3>
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 font-medium hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        {/* Left side empty for back button */}
                    </div>
                </div>
                <Link
                    href={`/admin/cars-management/add-page/${car._id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                    <Edit size={16} />
                    Edit Car
                </Link>
            </div>

            {/* Modern Hero Section */}
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden group shadow-2xl">
                {selectedImage ? (
                    <>
                        <img
                            src={selectedImage}
                            alt="Main"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute bottom-8 left-8 text-white space-y-2">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${car.status === 1 ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'}`}>
                                    {car.status === 1 ? 'Available Now' : 'Currently Unavailable'}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20">
                                    {car.type}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{car.brand} <span className="text-blue-400">{car.name}</span></h1>
                            <p className="text-gray-300 max-w-xl line-clamp-2">{car.description}</p>
                        </div>

                        <div className="absolute top-6 right-6 flex flex-col items-end">
                            <div className="bg-white/90 backdrop-blur-lg px-6 py-3 rounded-2xl shadow-lg border border-white/50 text-right">
                                <span className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-0.5">Starting at</span>
                                <span className="block text-3xl font-black text-gray-900">₹{car.hourlyCharge}<span className="text-sm font-medium text-gray-500 ml-1">/hr</span></span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-gray-600">
                        <CarFront size={80} className="mb-4 opacity-20" />
                        <p className="text-gray-500 font-medium">No images available for this vehicle</p>
                    </div>
                )}
            </div>

            {/* Thumbnail Strip */}
            {car.images && car.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto py-4 scrollbar-hide px-4">
                    {car.images.map((img: any, idx: number) => {
                        const imgUrl = typeof img === 'string' ? img : img.url;
                        return (
                            <div
                                key={idx}
                                onClick={() => setSelectedImage(imgUrl)}
                                className={`w-32 h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all shrink-0 bg-white ${selectedImage === imgUrl ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-300'}`}
                            >
                                <img
                                    src={imgUrl}
                                    alt=""
                                    className="w-full h-full object-contain p-1"
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Key Specs */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Vehicle Details</h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center">
                                <Users className="text-blue-600 mb-2" size={24} />
                                <span className="text-sm font-medium text-gray-900">{car.seatingCapacity} Seats</span>
                                <span className="text-xs text-gray-500">Capacity</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center">
                                <Gauge className="text-blue-600 mb-2" size={24} />
                                <span className="text-sm font-medium text-gray-900">{car.transmission}</span>
                                <span className="text-xs text-gray-500">Transmission</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center">
                                <Fuel className="text-blue-600 mb-2" size={24} />
                                <span className="text-sm font-medium text-gray-900">{car.fuelType}</span>
                                <span className="text-xs text-gray-500">Fuel Type</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Description</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{car.description}</p>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Specifications</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {car.specifications?.map((spec: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                        <img src={spec.icon} alt="" className="w-6 h-6 object-contain" />
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">{spec.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing & Packages */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Pricing Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Pricing</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Base Price</span>
                                <span className="font-semibold text-gray-900">₹{car.basePrice}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Hourly Charge</span>
                                <span className="font-semibold text-gray-900">₹{car.hourlyCharge}/hr</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-500">Extra Hour</span>
                                <span className="font-semibold text-gray-900">₹{car.additionalHourlyCharge}/hr</span>
                            </div>
                        </div>
                    </div>

                    {/* Packages */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Packages</h2>
                        <div className="space-y-3">
                            {car.packages?.map((pkgMap: any, idx: number) => (
                                <div key={idx} className={`p-3 rounded-xl border ${pkgMap.isActive ? 'border-green-100 bg-green-50/50' : 'border-gray-100 bg-gray-50'} transition-all`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{pkgMap.package.name}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pkgMap.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                            {pkgMap.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-gray-500">{pkgMap.package.hours} Hours / {pkgMap.package.distance} Km</span>
                                        <span className="font-bold text-gray-900">₹{pkgMap.price}</span>
                                    </div>
                                </div>
                            ))}
                            {(!car.packages || car.packages.length === 0) && (
                                <p className="text-sm text-gray-400 text-center py-4">No packages configured</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
