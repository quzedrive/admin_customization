import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check, Phone } from 'lucide-react';
import { useSiteSettingsQueries } from '@/lib/hooks/queries/useSiteSettingsQueries';

interface HeroProps {
    car: any; // Type defined in parent usage or comprehensive type
}

export default function Hero({ car }: HeroProps) {
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

    const { useSiteSettings } = useSiteSettingsQueries();
    const { data: settings } = useSiteSettings();

    // Initial setups
    useEffect(() => {
        if (car?.images?.length > 0) {
            // car.images can be strings (urls) or objects depending on population.
            // Based on checking other files, images seem to be populated objects with 'url'?
            // Let's handle both strings and objects to be safe based on controller populate.
            // Controller says: .populate('images') -> CarImage objects { url: string }
            const firstImg = car.images[0];
            setSelectedImage(typeof firstImg === 'string' ? firstImg : firstImg?.url || '');
        }

        // Default to base plan if available, else first package
        setSelectedPackageId('base-plan');
    }, [car]);

    if (!car) return null;

    const getImageUrl = (img: any) => {
        return typeof img === 'string' ? img : img?.url || '/placeholder-car.png';
    };

    const handlePackageSelect = (pkgId: string) => {
        setSelectedPackageId(pkgId);
    };

    // Construct base package from car data and settings
    // Ensure we don't double up on "Hours" if the setting already includes it
    const rawBaseHour = settings?.baseTiming || '';
    const baseHour = rawBaseHour.replace(/hours?/i, '').trim();

    const basePackage = {
        _id: 'base-plan',
        // Use the timing as the name for the base package as requested
        // Use the timing as the name for the base package as requested
        package: {
            name: baseHour ? `${baseHour} Hours` : 'Base Plan',
            time: baseHour ? `${baseHour} Hours` : 'Base Plan'
        },
        price: car.basePrice,
        discountPrice: 0,
        isBase: true,
        hours: '' // clear this since it's in the name now
    };

    // Combine packages, sorting the dynamic ones by price ascending
    const sortedPackages = [...(car.packages || [])].sort((a: any, b: any) => a.price - b.price);
    const allPackages = [basePackage, ...sortedPackages];

    const selectedPkg = allPackages.find((p: any) => p._id === selectedPackageId);

    return (
        <section className="max-w-[1920px] mx-auto px-[5.4%] py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

                {/* Left Column: Image Gallery */}
                <div className="flex flex-col-reverse md:flex-row gap-4 h-fit">
                    {/* Thumbnails - Left Side (Desktop) / Bottom (Mobile) */}
                    {car.images?.length > 1 && (
                        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[500px] scrollbar-none md:w-24 flex-shrink-0">
                            {car.images.map((img: any, idx: number) => {
                                const url = getImageUrl(img);
                                const isSelected = url === selectedImage;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(url)}
                                        className={`relative cursor-pointer flex-shrink-0 w-24 h-20 md:w-20 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${isSelected ? 'border-[#BFA05D]' : 'border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <Image
                                            src={url}
                                            alt={`${car.name} view ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Main Image */}
                    <div className="relative flex-1 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                        {selectedImage ? (
                            <Image
                                src={selectedImage}
                                alt={car.name}
                                fill
                                className="object-contain p-4"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                        )}
                    </div>
                </div>

                {/* Right Column: Details & Booking */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            {car.name}
                        </h1>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {car.transmission && (
                                <div className="px-3 py-1 rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-100 font-normal text-xs transition-colors">
                                    {car.transmission}
                                </div>
                            )}
                            {car.fuelType && (
                                <div className="px-3 py-1 rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-100 font-normal text-xs transition-colors">
                                    {car.fuelType}
                                </div>
                            )}
                            {car.seatingCapacity && (
                                <div className="px-3 py-1 rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-100 font-normal text-xs transition-colors">
                                    {car.seatingCapacity} Seat
                                </div>
                            )}
                        </div>

                        <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                            {car.description || `${car.brand} ${car.name} is a premium vehicle built for smooth and comfortable self-drive experiences.`}
                        </p>
                    </div>

                    {/* Packages Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mt-auto">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Selected package: {selectedPkg ? (
                                <>
                                    {selectedPkg.package?.name || 'Custom'} -
                                    {selectedPkg.discountPrice && selectedPkg.discountPrice > 0 ? (
                                        <span className="flex items-center gap-2">
                                            <span className="line-through text-red-400 text-sm font-bold">₹{selectedPkg.price?.toLocaleString()}</span>
                                            <span className="text-blue-600">₹{selectedPkg.discountPrice.toLocaleString()}</span>
                                        </span>
                                    ) : (
                                        ` ₹${selectedPkg.price?.toLocaleString()}`
                                    )}
                                </>
                            ) : 'Select a package'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {allPackages.map((pkg: any) => {
                                const isSelected = pkg._id === selectedPackageId;
                                // Cast to boolean to avoid '0' rendering
                                const hasDiscount = !!(pkg.discountPrice && pkg.discountPrice > 0);
                                const savings = hasDiscount ? (pkg.price - pkg.discountPrice) : 0;

                                return (
                                    <button
                                        key={pkg._id}
                                        onClick={() => handlePackageSelect(pkg._id)}
                                        className={`relative cursor-pointer flex flex-col justify-between p-4 rounded-xl border-2 transition-all text-left min-h-[100px] ${isSelected
                                            ? 'border-blue-400 bg-blue-50'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                            }`}
                                    >
                                        {/* Header: Name + Badge */}
                                        <div className="w-full flex items-center gap-2 mb-2">
                                            <span className={`text-base font-bold ${isSelected ? 'text-blue-500' : 'text-gray-900'}`}>
                                                {pkg.package?.time}
                                            </span>

                                            {hasDiscount && (
                                                <div className="border border-blue-200 bg-blue-50 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                    ₹{savings.toLocaleString()} Off
                                                </div>
                                            )}
                                        </div>

                                        {/* Price Section */}
                                        <div className="flex items-center gap-3 mt-auto">
                                            <span className={`text-2xl font-bold ${isSelected ? 'text-blue-500' : 'text-gray-950'}`}>
                                                ₹{(hasDiscount ? pkg.discountPrice : pkg.price)?.toLocaleString()}
                                            </span>

                                            {hasDiscount && (
                                                <span className="text-sm font-bold text-red-400 line-through decoration-2">
                                                    ₹{pkg.price?.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}

                            {/* Static "On Request" block for long bookings as shown in design */}
                            {/* Static "On Request" block for long bookings as shown in design */}
                            <div className="relative flex flex-row items-center justify-between p-4 rounded-xl border border-gray-100 bg-white min-h-[100px] md:col-span-2 lg:col-span-2">
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-gray-900 block mb-1">7 Days</span>
                                    <span className="text-sm font-medium text-gray-600">For Long Booking</span>
                                </div>
                                <button className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors uppercase">
                                    <Phone size={16} fill="currentColor" />
                                    On Request
                                </button>
                            </div>

                            {/* Static "Custom Package" block if needed? Or just stick to dynamic list + On Request */}
                        </div>

                        <div className="text-xs text-gray-400 mb-6">
                            *Additional Time Charged At ₹ {car.additionalHourlyCharge || 0} Per Hour
                        </div>

                        <button className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                            CHECK AVAILABILITY
                            <div className="w-5 h-5 flex items-center justify-center">→</div>
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}