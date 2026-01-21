'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
    label: string;
    count?: number;
    value: string;
}

interface FilterSectionProps {
    title: string;
    options: FilterOption[];
    selected: string[];
    onChange: (value: string) => void;
    isOpen?: boolean;
}

const FilterSection = ({ title, options, selected, onChange, isOpen = false }: FilterSectionProps) => {
    const [open, setOpen] = useState(isOpen);

    return (
        <div className="border-b border-gray-100 last:border-0 py-4">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between cursor-pointer w-full mb-2 group"
            >
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-800 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>
                {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-2 pt-2">
                            {options.map((option) => (
                                <label key={option.value} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(option.value)}
                                            onChange={() => onChange(option.value)}
                                            className="peer cursor-pointer h-4 w-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 checked:!bg-blue-600 checked:!border-blue-600 accent-blue-600"
                                        />
                                    </div>
                                    <span className={`text-sm flex-1 ${selected.includes(option.value) ? 'text-blue-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                        {option.label}
                                    </span>
                                    {option.count !== undefined && (
                                        <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                            {option.count}
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface FleetSidebarProps {
    filters: any;
    setFilters: (filters: any) => void;
    brands: string[];
    types: string[];
    className?: string;
    closeMobile?: () => void;
}

export default function FleetSidebar({ filters, setFilters, brands, types, className = '', closeMobile }: FleetSidebarProps) {

    // Toggle Handler
    const toggleFilter = (category: string, value: string) => {
        setFilters((prev: any) => {
            const current = prev[category] || [];
            if (current.includes(value)) {
                return { ...prev, [category]: current.filter((item: string) => item !== value) };
            } else {
                return { ...prev, [category]: [...current, value] };
            }
        });
    };

    // Remove single filter
    const removeFilter = (category: string, value: string) => {
        setFilters((prev: any) => ({
            ...prev,
            [category]: prev[category].filter((item: string) => item !== value)
        }));
    };

    // Calculate total active filters
    const totalFilters = (Object.values(filters) as any[]).reduce((acc: number, curr: any) => acc + curr.length, 0);

    const clearAll = () => {
        setFilters({ brands: [], types: [], transmission: [], fuelType: [], capacity: [] });
    };

    return (
        <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6 relative">
                <div className=''>
                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                {/* Clear All (Desktop) */}
                {totalFilters > 0 && (
                    <button
                        onClick={clearAll}
                        className="text-xs cursor-pointer font-bold text-red-500 hover:text-red-600 hover:underline"
                    >
                        Clear All
                    </button>
                )}
                </div>
                {/* Mobile Close */}
                {closeMobile && (
                    <button onClick={closeMobile} className="p-2 absolute top-0 right-0 hover:bg-gray-100 rounded-full lg:hidden">
                        <X size={20} />
                    </button>
                )}
                
            </div>

            {/* Active Filters Summary */}
            {totalFilters > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-100">
                    {Object.entries(filters).map(([category, values]: [string, any]) => (
                        values.map((val: string) => (
                            <div key={`${category}-${val}`} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold">
                                <span>{val}</span>
                                <button onClick={() => removeFilter(category, val)} className="hover:text-blue-900 cursor-pointer">
                                    <X size={12} />
                                </button>
                            </div>
                        ))
                    ))}
                </div>
            )}

            {/* Brand - Open by default */}
            <FilterSection
                title="Brands"
                options={brands.map(b => ({ label: b, value: b }))}
                selected={filters.brands || []}
                onChange={(val) => toggleFilter('brands', val)}
                isOpen={true}
            />

            {/* Body Type */}
            <FilterSection
                title="Car Type"
                options={types.map(t => ({ label: t, value: t }))}
                selected={filters.types || []}
                onChange={(val) => toggleFilter('types', val)}
            />

            {/* Transmission */}
            <FilterSection
                title="Transmission"
                options={[
                    { label: 'Automatic', value: 'Automatic' },
                    { label: 'Manual', value: 'Manual' },
                    { label: 'Semi-Automatic', value: 'Semi-Automatic' }
                ]}
                selected={filters.transmission || []}
                onChange={(val) => toggleFilter('transmission', val)}
            />

            {/* Fuel Type */}
            <FilterSection
                title="Fuel Type"
                options={[
                    { label: 'Petrol', value: 'Petrol' },
                    { label: 'Diesel', value: 'Diesel' },
                    { label: 'Electric', value: 'Electric' },
                    { label: 'Hybrid', value: 'Hybrid' }
                ]}
                selected={filters.fuelType || []}
                onChange={(val) => toggleFilter('fuelType', val)}
            />

            {/* Seating Capacity */}
            <FilterSection
                title="Capacity"
                options={[
                    { label: '2 Seats', value: '2' },
                    { label: '4 Seats', value: '4' },
                    { label: '5 Seats', value: '5' },
                    { label: '7 Seats', value: '7' },
                    { label: '8+ Seats', value: '8+' }
                ]}
                selected={filters.capacity || []}
                onChange={(val) => toggleFilter('capacity', val)}
            />
        </div>
    );
}
