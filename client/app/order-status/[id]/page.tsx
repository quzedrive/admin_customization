'use client';

import React, { useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useOrderQueries } from '@/lib/hooks/queries/useOrderQueries';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function OrderStatusPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = params.id as string;

    // Check for Razorpay query params to show specific success message
    const paymentId = searchParams.get('razorpay_payment_id');

    const { useTrackOrder } = useOrderQueries();
    const { data: order, isLoading, isError, refetch } = useTrackOrder(id);

    useEffect(() => {
        const verifyPayment = async () => {
            if (paymentId && order && (order.paymentStatus === 0 || order.paymentStatus === 2)) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/verify-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ paymentId, orderId: order._id || order.bookingId })
                    });

                    if (response.ok) {
                        refetch();
                    }
                } catch (error) {
                    console.error('Verification failed', error);
                }
            }
        };

        if (paymentId && order) {
            verifyPayment();
        }
    }, [paymentId, order, refetch]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
                <div className="text-center mb-8 bg-[#1a1a1a]/60 backdrop-blur-md p-8 rounded-2xl border border-gray-700 max-w-lg mx-auto">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-500 mb-4">
                        <AlertCircle size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
                    <p className="text-gray-400 mb-6">
                        We couldn't find an order with ID <span className="font-mono text-white">{id}</span>.
                    </p>
                    <Link href="/track" className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                        Go to Track Page
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-black">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-50">
                <Image
                    src="/track-page.webp"
                    alt="Track Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">

                {/* Success Card */}
                <div className="w-full bg-[#1a1a1a]/90 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-500 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                        <CheckCircle size={40} />
                    </div>

                    <h1 className="text-3xl font-black text-white mb-2">Payment Successful!</h1>
                    <p className="text-gray-300 text-lg mb-6">
                        Thank you, <span className="text-white font-bold">{order.name?.split(' ')[0] || "Customer"}</span>. <br />
                        Your ride is confirmed.
                    </p>

                    <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">Booking ID</span>
                            <span className="text-white font-mono">{order.bookingId || order._id}</span>
                        </div>
                        {paymentId && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Transaction Ref</span>
                                <span className="text-gray-500 text-xs font-mono">{paymentId}</span>
                            </div>
                        )}
                    </div>

                    <Link
                        href={`/track?id=${order.bookingId || order._id}`}
                        className="block w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
                    >
                        Track Your Ride
                    </Link>

                    <Link href="/" className="block mt-4 text-gray-500 hover:text-white text-sm transition">
                        Return to Home
                    </Link>
                </div>

            </div>
        </main>
    );
}