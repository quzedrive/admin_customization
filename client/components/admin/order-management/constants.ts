export const ORDER_STATUS_LABELS = {
    0: 'Deleted',
    1: 'Approved',
    2: 'New',
    3: 'Cancelled',
    4: 'Started',
    5: 'Ride Completed',
};

export const PAYMENT_STATUS_LABELS = {
    0: 'Unpaid',
    1: 'Paid',
    2: 'Pending',
};

export const ORDER_STATUS_COLORS = {
    0: 'bg-gray-100 text-gray-700',
    1: 'bg-blue-100 text-blue-700',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-red-100 text-red-700',
    4: 'bg-purple-100 text-purple-700',
    5: 'bg-green-100 text-green-700',
    6: 'bg-emerald-100 text-emerald-700',
};

export const PAYMENT_STATUS_COLORS = {
    0: 'text-red-600',
    1: 'text-green-600',
    2: 'text-orange-600',
};

export const PAGINATION_SIZES = [
    { value: '10', label: '10 per page' },
    { value: '25', label: '25 per page' },
    { value: '50', label: '50 per page' },
];

export const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'tripDesc', label: 'Trip Date (Newest)' },
    { value: 'tripAsc', label: 'Trip Date (Oldest)' },
];
