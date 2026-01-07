'use client';

import React from 'react';
import CarForm from '@/components/admin/cars-management/CarForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddCarPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/cars-management/list-page"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Car</h1>
            <p className="text-sm text-gray-500">Create a new vehicle listing with specs and packages</p>
          </div>
        </div>
      </div>

      <CarForm />
    </div>
  );
}