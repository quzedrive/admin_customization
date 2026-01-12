import CarDetailLayout from '@/components/car-detail/CarDetailLayout';
import React from 'react'

// Next.js 15+ (and 16) requires params to be a Promise
export default async function Page({ params }: { params: Promise<{ detail: string }> }) {
    // Await the params object
    const { detail } = await params;

    return (
        <div>
            <CarDetailLayout detail={detail}/>
        </div>
    )
}