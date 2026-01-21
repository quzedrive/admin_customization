'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check, Phone } from 'lucide-react';
import { useSiteSettingsQueries } from '@/lib/hooks/queries/useSiteSettingsQueries';
import PopupUser from '@/components/PopupUser';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { setSearchFormData } from '@/redux/slices/searchSlice';
import dayjs from 'dayjs';
import Link from 'next/link';

interface HeroProps {
    car: any; // Type defined in parent usage or comprehensive type
    settings: any;
}

export default function Hero({ car, settings }: HeroProps) {
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingPkgId, setPendingPkgId] = useState<string | null>(null);

    const dispatch = useDispatch();
    const { formData } = useSelector((state: RootState) => state.search);
    const [showPopup, setShowPopup] = useState(false);

    // Helper to parse package time strings into hours
    const parseDurationToHours = (timeStr: string): number => {
        if (!timeStr) return 0;
        const lower = timeStr.toLowerCase();
        const num = parseInt(lower.match(/\d+/)?.[0] || '0', 10);

        if (lower.includes('day')) return num * 24;
        if (lower.includes('week')) return num * 24 * 7;
        if (lower.includes('month')) return num * 24 * 30;
        return num; // assume hours if not specified or explicit
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

    // Dynamic Price Calculation
    let calculationDetails = null;
    let computedPrice = 0;

    if (formData.tripStart && formData.tripEnd) {
        const start = dayjs(formData.tripStart);
        const end = dayjs(formData.tripEnd);
        const totalHours = end.diff(start, 'hour');

        if (totalHours > 0) {
            const baseHoursVal = parseInt(baseHour) || 12; // Default to 12 if parsing fails

            // Check for 7 days or more -> On Request
            if (totalHours >= 168) {
                calculationDetails = {
                    totalHours,
                    isOnRequest: true,
                    days: Math.floor(totalHours / 24),
                    remainingHours: totalHours % 24,
                    breakdown: 'Long Duration Booking',
                    price: 0
                };
            } else {
                // Check for exact package match first
                const exactMatchPackage = allPackages.find((p: any) => {
                    const pkgHours = parseDurationToHours(p.package?.time || p.package?.name || '');
                    return pkgHours === totalHours && pkgHours > 0;
                });

                if (exactMatchPackage) {
                    computedPrice = exactMatchPackage.discountPrice > 0 ? exactMatchPackage.discountPrice : exactMatchPackage.price;
                    calculationDetails = {
                        totalHours,
                        days: Math.floor(totalHours / 24),
                        remainingHours: totalHours % 24,
                        breakdown: `Exact Match: ${exactMatchPackage.package?.name || exactMatchPackage.package?.time}`,
                        price: computedPrice
                    };
                } else {
                    // New Recursive/Additive Calculation Logic
                    let remainingCalcHours = totalHours;
                    let currentPrice = 0;
                    let breakdownParts: string[] = [];

                    // 1. Sort packages by duration (desc correct?)
                    // actually we want largest first to be greedy
                    // Refined "Base Tier + Extension" Logic
                    // 1. Identify valid packages and sort desc
                    const sortedPackages = allPackages
                        .map((p: any) => ({
                            ...p,
                            parsedHours: parseDurationToHours(p.package?.time || '')
                        }))
                        .filter((p: any) => p.parsedHours > 0)
                        .sort((a: any, b: any) => b.parsedHours - a.parsedHours);

                    // 2. Find the "Base Tier" Package (Largest that fits in Total Duration)
                    const basePackage = sortedPackages.find((p: any) => p.parsedHours <= totalHours);

                    if (basePackage) {
                        // Apply Base Package Multiples
                        const count = Math.floor(remainingCalcHours / basePackage.parsedHours);
                        const pkgPrice = basePackage.discountPrice > 0 ? basePackage.discountPrice : basePackage.price;

                        currentPrice += count * pkgPrice;
                        remainingCalcHours -= count * basePackage.parsedHours;
                        breakdownParts.push(`${count > 1 ? count + ' x ' : ''}${basePackage.package?.name || basePackage.package?.time}`);

                        // Apply Extension Logic using Base Tier's Half Day Price
                        // User Rule: "for 3 to 5 use the 3 days... and half day price".
                        // This implies strictly using the tier's extension rate for the remainder.

                        const tierHalfDayPrice = basePackage.halfDayPrice > 0 ? basePackage.halfDayPrice : 0;

                        if (remainingCalcHours >= 12 && tierHalfDayPrice > 0) {
                            const extensionBlocks = Math.floor(remainingCalcHours / 12);
                            currentPrice += extensionBlocks * tierHalfDayPrice;
                            remainingCalcHours -= extensionBlocks * 12;
                            breakdownParts.push(`${extensionBlocks > 1 ? extensionBlocks + ' x ' : ''}Half Day Ext (${basePackage.parsedHours >= 24 ? 'Tier Rate' : 'Rate'})`);
                        }

                        // If no half day price defined, or < 12h, falls through to hourly.
                    } else {
                        // Trip is shorter than smallest package (e.g. 5 hours vs 12h pkg)
                        // Handled by Hourly logic below
                    }

                    // Hourly fallback for whatever is left (< 12h usually, or if no pkg match)

                    // 3. Handle remaining hours with Hourly Charge
                    if (remainingCalcHours > 0) {
                        if (currentPrice === 0 && remainingCalcHours <= baseHoursVal) {
                            currentPrice = car.basePrice;
                            breakdownParts.push(`${baseHoursVal} Hours (Min)`);
                            remainingCalcHours = 0; // consumed
                        } else {
                            const hourlyCost = remainingCalcHours * (car.hourlyCharge || 0);
                            currentPrice += hourlyCost;
                            breakdownParts.push(`${remainingCalcHours} Hrs x ₹${car.hourlyCharge}`);
                        }
                    }

                    calculationDetails = {
                        totalHours,
                        days: Math.floor(totalHours / 24),
                        remainingHours: totalHours % 24,
                        breakdown: breakdownParts.join(' + '),
                        price: currentPrice
                    };
                }
            }
        }
    }

    const confirmPackageChange = () => {
        if (pendingPkgId) {
            setSelectedPackageId(pendingPkgId);
            const pkg = allPackages.find((p: any) => p._id === pendingPkgId);
            if (pkg) {
                const hours = parseDurationToHours(pkg.package?.time || pkg.package?.name || '');
                if (hours > 0) {
                    const start = formData.tripStart ? dayjs(formData.tripStart) : dayjs();
                    const newEnd = start.add(hours, 'hour');

                    dispatch(setSearchFormData({
                        tripStart: start.toISOString(),
                        tripEnd: newEnd.toISOString()
                    }));
                }
            }
            setShowConfirm(false);
            setPendingPkgId(null);
        }
    };

    const handlePackageSelect = (pkgId: string) => {
        // If currently in custom calculation mode (dates selected but not exact match), ask for confirmation
        // Also check if isOnRequest is active (which is also a custom state)
        const isCustomCalcActive = calculationDetails && !calculationDetails.breakdown.includes('Exact Match');

        if (isCustomCalcActive) {
            setPendingPkgId(pkgId);
            setShowConfirm(true);
        } else {
            setSelectedPackageId(pkgId);
            const pkg = allPackages.find((p: any) => p._id === pkgId);
            if (pkg) {
                const hours = parseDurationToHours(pkg.package?.time || pkg.package?.name || '');
                if (hours > 0) {
                    const start = formData.tripStart ? dayjs(formData.tripStart) : dayjs();
                    const newEnd = start.add(hours, 'hour');

                    dispatch(setSearchFormData({
                        tripStart: start.toISOString(),
                        tripEnd: newEnd.toISOString()
                    }));
                }
            }
        }
    };

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

        // Pre-fill car data in search form if not already set or different
        // Only if not already searching (to avoid overwriting user selection if they navigated here with filters)
        // But for "Car Type" in form, it should probably match this car.
        // Let's ensure the car details are updated in Redux when viewing this car
        if (car) {
            dispatch(setSearchFormData({
                carId: car._id,
                carName: car.name,
                carSlug: car.slug
            }));
        }

    }, [car, dispatch]);


    if (!car) return null;

    const getImageUrl = (img: any) => {
        return typeof img === 'string' ? img : img?.url || '/placeholder-car.png';
    };

    const selectedPkg = allPackages.find((p: any) => p._id === selectedPackageId);

    return (
        <section className="max-w-[1920px] mx-auto px-[5.4%] py-8 md:py-12 relative">
            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Change Package?</h3>
                        <p className="text-gray-600 mb-6">
                            Switching to this package will update your selected trip dates. Do you want to continue?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPackageChange}
                                className="flex-1 px-4 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-900 transition-colors"
                            >
                                Try Package
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 ">
                {/* ... Left Column ... */}
                {/* Left Column: Image Gallery */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    {/* Thumbnails - Left Side (Desktop) / Bottom (Mobile) */}
                    {car.images?.length > 1 && (
                        <div className="flex order-2 md:order-none md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[500px] no-scrollbar md:w-24 flex-shrink-0">
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
                    <div className="relative order-1 md:order-none w-full md:w-auto md:flex-1 h-[300px] md:h-[500px] shrink-0 md:shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
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
                    <div className="mb-3">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            {car.name}
                        </h1>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {car.transmission && (
                                <div className="px-3 py-1 rounded-full icon-bg-light font-normal text-xs transition-colors">
                                    {car.transmission}
                                </div>
                            )}
                            {car.fuelType && (
                                <div className="px-3 py-1 rounded-full icon-bg-light font-normal text-xs transition-colors">
                                    {car.fuelType}
                                </div>
                            )}
                            {car.seatingCapacity && (
                                <div className="px-3 py-1 rounded-full icon-bg-light font-normal text-xs transition-colors">
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
                        <h3 className="text-lg font-bold text-green-600 mb-6 flex items-center gap-2">
                            Selected package: {calculationDetails && !calculationDetails.isOnRequest && !calculationDetails.breakdown.includes('Exact Match') ? (
                                `Custom Trip (${calculationDetails.totalHours} Hours) - ₹${calculationDetails.price.toLocaleString()}`
                            ) : calculationDetails && calculationDetails.isOnRequest ? (
                                `Long Duration Trip`
                            ) : selectedPkg ? (
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {(() => {
                                // 1. Helper to calculate hours for a package
                                const getHours = (p: any) => parseDurationToHours(p.package?.time || '');

                                // 2. Create the unified list of items (standard packages + custom calc)
                                let displayItems = allPackages.map((p: any) => ({
                                    ...p,
                                    type: 'package',
                                    hours: getHours(p),
                                    originalId: p._id // keep ref
                                }));

                                const isCustomCalc = calculationDetails && !calculationDetails.isOnRequest && !calculationDetails.breakdown.includes('Exact Match');
                                const isOnRequest = calculationDetails && calculationDetails.isOnRequest;

                                if (isCustomCalc) {
                                    displayItems.push({
                                        _id: 'custom-calc',
                                        type: 'custom',
                                        hours: calculationDetails.totalHours,
                                        price: calculationDetails.price,
                                        package: { time: `${calculationDetails.totalHours} Hours` }
                                    });
                                } else if (isOnRequest) {
                                    displayItems.push({
                                        _id: 'custom-request',
                                        type: 'request',
                                        hours: calculationDetails.totalHours,
                                        price: 0,
                                        package: { time: `${Math.floor(calculationDetails.totalHours / 24)} Days` } // Approximation
                                    });
                                }

                                // 3. Sort by hours
                                displayItems.sort((a: any, b: any) => a.hours - b.hours);

                                // 4. Identify the "Active" item to determine recommendation
                                let activeIndex = -1;

                                if (isCustomCalc) {
                                    activeIndex = displayItems.findIndex((i: any) => i.type === 'custom');
                                } else if (isOnRequest) {
                                    activeIndex = displayItems.findIndex((i: any) => i.type === 'request');
                                } else if (calculationDetails && calculationDetails.breakdown.includes('Exact Match')) {
                                    activeIndex = displayItems.findIndex((i: any) => i.type === 'package' && i.hours === calculationDetails.totalHours);
                                } else {
                                    activeIndex = displayItems.findIndex((i: any) => i.originalId === selectedPackageId);
                                }

                                // 5. Determine Recommended Item (Next one after active - ONLY IF CUSTOM)
                                // If isOnRequest, we don't necessarily need the next one (it's likely the last one).
                                const recommendedIndex = isCustomCalc && activeIndex >= 0 && activeIndex < displayItems.length - 1 ? activeIndex + 1 : -1;
                                const recommendedId = recommendedIndex !== -1 ? displayItems[recommendedIndex]._id : null;


                                return displayItems.map((item: any) => {
                                    const isRecommended = item._id === recommendedId;

                                    if (item.type === 'custom') {
                                        return (
                                            <button
                                                key="custom-calc"
                                                className={`relative cursor-pointer flex flex-col justify-between rounded-xl border-2 transition-all text-left min-h-[100px] overflow-hidden ${isRecommended ? 'border-blue-100 bg-white pt-8 p-4' : 'border-blue-400 bg-blue-50 p-4'
                                                    }`}
                                            >
                                                {isRecommended && (
                                                    <div className="absolute top-0 left-0 right-0 bg-blue-100 text-blue-500 text-[10px] font-bold py-1 text-center rounded-t-[10px]">
                                                        Recommended
                                                    </div>
                                                )}
                                                <div className="w-full flex items-center gap-2 mb-2">
                                                    <span className="text-base font-bold text-blue-500">
                                                        {item.hours} Hours
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-auto">
                                                    <span className="text-2xl font-bold text-blue-500">
                                                        ₹{item.price.toLocaleString()}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    }

                                    if (item.type === 'request') {
                                        return (
                                            <div
                                                key="custom-request"
                                                className="relative flex flex-col justify-between p-4 rounded-xl border-2 border-blue-600 bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg min-h-[100px] md:col-span-2 lg:col-span-2"
                                            >
                                                <div className="w-full mb-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-lg font-bold">
                                                            Long Duration?
                                                        </span>
                                                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm">
                                                            {item.package.time}+
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-blue-100 leading-tight">
                                                        Unlock exclusive savings for extended trips.
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-auto">
                                                    <Link
                                                        href={`tel:${settings?.contact?.phone || ''}`}
                                                        className="w-full py-2 bg-white text-blue-700 font-bold rounded-lg text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Phone size={14} />
                                                        On Request
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    }

                                    const pkg = item;
                                    // Visual Selection Logic
                                    let isPkgSelected = false;
                                    if (isCustomCalc || isOnRequest) {
                                        isPkgSelected = false; // Custom request or price takes focus
                                    } else if (calculationDetails && calculationDetails.breakdown.includes('Exact Match')) {
                                        isPkgSelected = pkg.hours === calculationDetails.totalHours;
                                    } else {
                                        isPkgSelected = pkg.originalId === selectedPackageId;
                                    }

                                    // Cast to boolean to avoid '0' rendering
                                    const hasDiscount = !!(pkg.discountPrice && pkg.discountPrice > 0);
                                    const savings = hasDiscount ? (pkg.price - pkg.discountPrice) : 0;

                                    return (
                                        <button
                                            key={pkg._id}
                                            onClick={() => handlePackageSelect(pkg._id)}
                                            className={`relative cursor-pointer flex flex-col justify-between rounded-xl border-2 transition-all text-left min-h-[100px] overflow-hidden ${isPkgSelected
                                                ? 'border-blue-400 bg-blue-50'
                                                : isRecommended ? 'border-blue-100 bg-white' : 'border-gray-100 hover:border-gray-200 bg-white'
                                                } ${isRecommended ? 'pt-8 p-4' : 'p-4'}`}
                                        >
                                            {isRecommended && (
                                                <div className="absolute top-0 left-0 right-0 bg-blue-100 text-blue-500 text-[10px] font-bold py-1 text-center rounded-t-[10px]">
                                                    Recommended
                                                </div>
                                            )}
                                            {/* Header: Name + Badge */}
                                            <div className="w-full flex flex-wrap items-center gap-2 mb-2">
                                                <span className={`text-base font-bold ${isPkgSelected ? 'text-blue-500' : 'text-gray-900'}`}>
                                                    {pkg.package?.time}
                                                </span>

                                                {hasDiscount && (
                                                    <div className="border border-blue-200 bg-blue-50 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                        ₹{savings.toLocaleString()} Off
                                                    </div>
                                                )}
                                            </div>

                                            {/* Price Section */}
                                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0 mt-auto">
                                                <span className={`text-2xl font-bold ${isPkgSelected ? 'text-blue-500' : 'text-gray-950'}`}>
                                                    ₹{(hasDiscount ? pkg.discountPrice : pkg.price)?.toLocaleString()}
                                                </span>

                                                {hasDiscount && (
                                                    <span className="text-xs sm:text-sm font-bold text-red-400 line-through decoration-2 opacity-80">
                                                        ₹{pkg.price?.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                });
                            })()}

                            {/* Static "On Request" block - Hide if redundant (i.e. if we are showing a dynamic Request card) -> logic: if isOnRequest is true, we showed a card. BUT wait, isOnRequest is only true if user selected dates. 
                            If user has NOT selected dates, we still want the static 7 Days option visible as an advertisement? 
                            The user design usually has it. 
                            If the dynamic card is shown (e.g. 8 days selected), do we also show the 7 days static? 
                            It might look weird to have "8 Days+ - Call" and "7 Days - Call".
                            Let's hide the static one if calculationDetails.isOnRequest is true.
                            */}
                            {(!calculationDetails || !calculationDetails.isOnRequest) && (
                                <div className="relative flex flex-col md:flex-row items-start gap-3 md:gap-0 md:items-center justify-between p-4 rounded-xl border border-gray-100 bg-white min-h-[100px] md:col-span-2 lg:col-span-2">
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold text-gray-900 block mb-1">7 Days</span>
                                        <span className="text-sm font-medium text-gray-600">For Long Booking</span>
                                    </div>
                                    <Link
                                        href={`tel:${settings?.contact?.phone || ''}`}
                                        className="cursor-pointer bg-blue-500 hover:bg-blue-600 !text-white text-sm font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors uppercase antialiased"
                                        style={{ color: '#ffffff' }}
                                    >
                                        <Phone size={16} fill="currentColor" className="text-white" />
                                        On Request
                                    </Link>
                                </div>
                            )}

                        </div>

                        <div className="text-xs text-gray-400 mb-6">
                            *Additional Time Charged At ₹ {car.additionalHourlyCharge || 0} Per Hour
                        </div>

                        <button
                            onClick={() => setShowPopup(true)}
                            className="w-full cursor-pointer secondary-btn font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all antialiased"
                            style={{ color: '#ffffff' }}
                        >
                            CHECK AVAILABILITY
                            <div className="w-5 h-5 flex items-center justify-center text-white">→</div>
                        </button>
                    </div>

                </div>
            </div>

            {showPopup && (
                <PopupUser
                    onClose={() => setShowPopup(false)}
                    leadData={{
                        ...formData,
                        selectedPackage: calculationDetails
                            ? calculationDetails.isOnRequest
                                ? `Long Duration (${calculationDetails.totalHours} Hours) - On Request`
                                : `${calculationDetails.totalHours} Hours - ₹${calculationDetails.price.toLocaleString()}`
                            : selectedPkg
                                ? `${selectedPkg.package?.name || selectedPkg.package?.time} - ₹${(selectedPkg.discountPrice && selectedPkg.discountPrice > 0 ? selectedPkg.discountPrice : selectedPkg.price).toLocaleString()}`
                                : ''
                    } as any}
                    setLeadData={(data) => dispatch(setSearchFormData(data))}
                />
            )}
        </section>
    );
}