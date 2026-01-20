
import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Car, MapPin, Clock, UserCheck, Pencil, Trash2, SquareX, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/components/admin/order-management/constants';

interface OrderTableViewProps {
    orders: any[];
    formatDate: (date: string) => string;
    viewHostDetails: (details: any) => void;
    confirmDelete: (id: string) => void;
    cancelOrder: (id: string) => void;
    onUpdatePaymentStatus: (id: string, currentStatus: number) => void;
}

export default function OrderTableView({ orders, formatDate, viewHostDetails, confirmDelete, cancelOrder, onUpdatePaymentStatus }: OrderTableViewProps) {
    return (
        <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Order Info</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Trip Details</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order: any) => (
                            <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <div className="font-medium text-gray-900">{order.carName || 'Unknown Car'}</div>
                                        <div className="text-xs text-gray-500 py-1">{order.selectedPackage}</div>
                                        <div className="flex items-center gap-2 mt-0.5">
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
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <div className="font-medium text-gray-900">{order.name}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Mail size={10} /> {order.email}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={10} /> {order.phone}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <div className="space-y-1">
                                        <div className="flex items-start gap-1 text-xs">
                                            <Clock size={12} className="mt-0.5 shrink-0 text-gray-400" />
                                            <span>{formatDate(order.tripStart)}</span>
                                        </div>
                                        <div className="flex items-start gap-1 text-xs">
                                            <MapPin size={12} className="mt-0.5 shrink-0 text-gray-400" />
                                            <span className="truncate">{order.location}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5 items-start">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS]}`}>
                                            {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
                                        </span>
                                        <span className={`text-xs px-1 font-medium ${PAYMENT_STATUS_COLORS[order.paymentStatus as keyof typeof PAYMENT_STATUS_COLORS]}`}>
                                            {PAYMENT_STATUS_LABELS[order.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS]}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
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
                                            onClick={() => onUpdatePaymentStatus(order._id, order.paymentStatus)}
                                            className="p-1.5 cursor-pointer text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                                            title="Update Payment Status"
                                        >
                                            <CreditCard size={16} />
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(order._id)}
                                            className="p-1.5 cursor-pointer text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Order"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
