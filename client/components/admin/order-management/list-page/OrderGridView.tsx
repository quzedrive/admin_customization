
import React from 'react';
import Link from 'next/link';
import { Phone, Car, MapPin, Clock, UserCheck, Pencil, Trash2, SquareX, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/components/admin/order-management/constants';

interface OrderGridViewProps {
    orders: any[];
    formatDate: (date: string) => string;
    viewHostDetails: (details: any) => void;
    confirmDelete: (id: string) => void;
    cancelOrder: (id: string) => void;
    onUpdatePaymentStatus: (id: string, currentStatus: number) => void;
}

export default function OrderGridView({ orders, formatDate, viewHostDetails, confirmDelete, cancelOrder, onUpdatePaymentStatus }: OrderGridViewProps) {
    return (
        <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            {orders.map((order: any) => (
                <div key={order._id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                    <div className="p-5 flex-1 flex flex-col gap-4">

                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-xs font-mono text-gray-400">{order.bookingId || '#' + order._id.slice(-6)}</span>
                                <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{order.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-mono text-gray-400">{order.bookingId || '#' + order._id.slice(-6)}</span>
                                    {order.hostType === 1 && (
                                        <span className="text-[10px] uppercase font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full border border-green-200">
                                            Self Hosted
                                        </span>
                                    )}
                                    {order.hostType === 2 && (
                                        <span className="text-[10px] uppercase font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded-full border border-orange-200">
                                            Attachment
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS]}`}>
                                {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-gray-400" />
                                <span>{order.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Car size={14} className="text-gray-400" />
                                <span className="font-medium text-gray-900">{order.carName || 'Unknown Car'}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-gray-400 mt-1" />
                                <span className="line-clamp-2">{order.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-gray-400" />
                                <div className="flex flex-col">
                                    <span className="text-xs">Start: {formatDate(order.tripStart)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                            <span className={`text-xs font-semibold ${PAYMENT_STATUS_COLORS[order.paymentStatus as keyof typeof PAYMENT_STATUS_COLORS]}`}>
                                {PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS]}
                            </span>
                            <div className="flex items-center gap-2">
                                {order.status !== 3 && (
                                    <>
                                        {order.hostType === 2 && order.hostDetails && (
                                            <button
                                                onClick={() => viewHostDetails(order.hostDetails)}
                                                className="p-1.5 cursor-pointer text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-100"
                                                title="View Host Details"
                                            >
                                                <UserCheck size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onUpdatePaymentStatus(order._id, order.paymentStatus)}
                                            className="p-1.5 cursor-pointer text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                                            title="Update Payment Status"
                                        >
                                            <CreditCard size={16} />
                                        </button>
                                        <Link
                                            href={`/admin/order-management/edit-page/${order.bookingId || order._id}`}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Order"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                        <button
                                            onClick={() => cancelOrder(order._id)}
                                            className="p-1.5 cursor-pointer text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                            title="Mark as Cancelled"
                                        >
                                            <SquareX size={16} />
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => confirmDelete(order._id)}
                                    className="p-1.5 cursor-pointer text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Order"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            ))}
        </motion.div>
    );
}
