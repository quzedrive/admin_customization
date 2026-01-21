import { Schema, Document, model } from 'mongoose';
import { RideStatus, PaymentStatus } from '../../constants/ride';

export interface IOrder extends Document {
    name: string;
    email: string;
    phone: string;
    tripStart?: Date;
    tripEnd?: Date;
    location?: string;
    message?: string;
    carName?: string;
    selectedPackage?: string;
    carSlug?: string;
    finalPrice?: number;
    // Keeping old fields as optional just in case, or removing if strictly replacing? User said "this is the order data update"
    // I will assume these replace pickup/drop/date/passengers.
    status: number;
    paymentStatus: number;
    payment: {
        transactionId?: string;
        link?: string;
        linkId?: string;
        screenshot?: string;
    };
    cancelReason?: string;
    cancelReasonId?: string;
    bookingId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        tripStart: { type: Date },
        tripEnd: { type: Date },
        location: { type: String },
        message: { type: String },
        carName: { type: String },
        carSlug: { type: String },
        selectedPackage: { type: String },
        finalPrice: { type: Number },
        status: { type: Number, default: RideStatus.NEW, enum: Object.values(RideStatus) },
        paymentStatus: { type: Number, default: 0 }, // 0: Unpaid, 1: Paid, 2: Pending, 3: Failed
        payment: {
            transactionId: { type: String },
            link: { type: String },
            linkId: { type: String },
            screenshot: { type: String },
        },
        cancelReason: { type: String },
        cancelReasonId: { type: Schema.Types.ObjectId, ref: 'CancellationReason' },
        bookingId: { type: String, unique: true, index: true, sparse: true },
    },
    { collection: 'orders', timestamps: true }
);

OrderSchema.index({ name: 'text', email: 'text', phone: 'text' });

const Order = model<IOrder>('Orders', OrderSchema);



export default Order;
