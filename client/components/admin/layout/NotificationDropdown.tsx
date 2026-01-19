"use client";

import { useEffect, useState, useRef } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '@/lib/hooks/queries/useNotificationQueries';
import { useNotificationMutations } from '@/lib/hooks/mutations/useNotificationMutations';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

interface Notification {
    _id: string;
    title: string;
    message: string;
    link?: string;
    status: number; // 0: Deleted, 1: Read, 2: New
    createdAt: string;
}

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Queries & Mutations
    const {
        data: queryData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useNotifications();
    const { markAsReadMutation, markAllAsReadMutation, deleteNotificationMutation } = useNotificationMutations();

    // Sync Query Data to Local State
    useEffect(() => {
        if (queryData) {
            // Flatten pages
            const allNotifications = queryData.pages.flatMap(page => page.notifications);
            setNotifications(allNotifications);

            // Unread count from the latest page (or first page)
            if (queryData.pages.length > 0) {
                setUnreadCount(queryData.pages[0].unreadCount);
            }
        }
    }, [queryData]);

    // Scroll Handler
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50) { // Load when near bottom
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    };


    // Socket Connection
    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        newSocket.on('new_notification', (notification: Notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ));
            const audio = new Audio('/assets/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed', e));
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Outside Click Handling
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkRead = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        markAsReadMutation.mutate(id, {
            onSuccess: () => {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, status: 1 } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        });
    };

    const handleMarkAllRead = () => {
        markAllAsReadMutation.mutate(undefined, {
            onSuccess: () => {
                setNotifications(prev => prev.map(n => ({ ...n, status: 1 })));
                setUnreadCount(0);
            }
        });
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        deleteNotificationMutation.mutate(id, {
            onSuccess: () => {
                const wasUnread = notifications.find(n => n._id === id)?.status === 2;
                setNotifications(prev => prev.filter(n => n._id !== id));
                if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
            }
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all cursor-pointer"
            >
                <Bell className="w-5 h-5" /> {/* Size 20 in Header is w-5 h-5 usually, Lucide defaults to 24 (w-6), Header had size={20}. I'll set className w-5 h-5 or size={20} to match exactly */}
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-4 right-4 top-[4.5rem] w-auto md:absolute md:left-auto md:right-0 md:top-auto md:w-96 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="cursor-pointer text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
                                >
                                    <Check className="w-3 h-3" /> Mark all read
                                </button>
                            )}
                        </div>

                        <div
                            className="max-h-[20rem] overflow-y-auto no-scrollbar"
                            onScroll={handleScroll}
                        >
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                    <Bell className="w-12 h-12 mb-3 text-gray-200" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                <ul>
                                    {notifications.map((notification) => (
                                        <li key={notification._id} className={`group relative border-b last:border-0 border-gray-50 transition-colors hover:bg-gray-50 ${notification.status === 2 ? 'bg-blue-50/60' : ''}`}>
                                            <Link href={notification.link || '#'} className="block p-4" onClick={() => setIsOpen(false)}>
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notification.status === 2 ? 'bg-blue-500' : 'bg-transparent group-hover:bg-gray-200'}`} />
                                                    <div className="flex-1 min-w-0 pr-14">
                                                        <p className={`text-sm font-medium ${notification.status === 2 ? 'text-gray-900' : 'text-gray-600'}`}>
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 mt-1.5">
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Actions Overlay */}
                                            <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                                                {notification.status === 2 && (
                                                    <button
                                                        onClick={(e) => handleMarkRead(notification._id, e)}
                                                        className="p-1.5 cursor-pointer rounded-full bg-white shadow-sm border border-gray-200 hover:text-blue-600 hover:border-blue-200 transition-all hover:scale-110"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => handleDelete(notification._id, e)}
                                                    className="p-1.5 cursor-pointer rounded-full bg-white shadow-sm border border-gray-200 hover:text-red-600 hover:border-red-200 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {isFetchingNextPage && (
                                <div className="p-2 text-center text-xs text-gray-400">Loading more...</div>
                            )}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
