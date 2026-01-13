export enum RideStatus {
    DELETED = 0,
    APPROVE = 1, // Confirmed
    NEW = 2, // Pending
    CANCEL = 3,
    RIDE_STARTED = 4,
    RIDE_COMPLETED = 5,
}

export const rideStatusConfig: Record<number, { label: string; color: string }> = {
    [RideStatus.DELETED]: { label: 'Deleted', color: '#94a3b8' },
    [RideStatus.NEW]: { label: 'Pending', color: '#f59e0b' },
    [RideStatus.APPROVE]: { label: 'Confirmed', color: '#3b82f6' },
    [RideStatus.CANCEL]: { label: 'Cancelled', color: '#ef4444' },
    [RideStatus.RIDE_STARTED]: { label: 'On Trip', color: '#8b5cf6' },
    [RideStatus.RIDE_COMPLETED]: { label: 'Completed', color: '#10b981' },
};

export enum PaymentStatus {
    NOT_DONE = 0,
    COMPLETED = 1,
    PENDING = 2,
}
