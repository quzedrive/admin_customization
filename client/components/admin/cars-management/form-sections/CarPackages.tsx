
import React from 'react';
import { Package as PackageIcon, Loader2 } from 'lucide-react';
import FloatingInput from '@/components/inputs/FloatingInput';
import { CarFormData } from '../types';

interface CarPackagesProps {
    formData: CarFormData;
    availablePackages: any[];
    packagesLoading: boolean;

    handlePackageChange: (index: number, field: 'price' | 'discountPrice' | 'isActive', value: any) => void;
}

export default function CarPackages({
    formData,
    availablePackages,
    packagesLoading,
    handlePackageChange
}: CarPackagesProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                    <PackageIcon size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Packages Configuration</h2>
                    <p className="text-sm text-gray-500">Configure availability and pricing for each package</p>
                </div>
            </div>

            <div className="space-y-4">
                {packagesLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500" /></div>
                ) : availablePackages.length === 0 ? (
                    <p className="text-gray-500">No packages found in the system.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {availablePackages.map((pkg: any, index: number) => {
                            const formPkg = formData.packages[index];
                            if (!formPkg || formPkg.package !== pkg._id) {
                                return <div key={pkg._id}>Loading package data...</div>;
                            }

                            return (
                                <div key={pkg._id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-colors">

                                    {/* Package Info */}
                                    <div className="w-1/3">
                                        <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                                        <p className="text-xs text-gray-500 truncate">{pkg.description || 'No description'}</p>
                                    </div>

                                    {/* Inputs */}
                                    <div className="flex-1 flex flex-col gap-3">
                                        <div className="w-full grid grid-cols-2 gap-4">
                                            <FloatingInput
                                                label="Regular Price"
                                                type="number"
                                                value={formPkg.price ?? ''}
                                                onChange={(e) => handlePackageChange(index, 'price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                                color='blue'
                                            />
                                            <FloatingInput
                                                label="Discount Price"
                                                type="number"
                                                value={formPkg.discountPrice ?? ''}
                                                onChange={(e) => handlePackageChange(index, 'discountPrice', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                                color='green'
                                            />
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={formPkg.isActive}
                                                        onChange={(e) => handlePackageChange(index, 'isActive', e.target.checked)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                                        {formPkg.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </label>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
