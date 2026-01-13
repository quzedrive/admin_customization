import { Model } from 'mongoose';

/**
 * Generates a unique booking ID based on the current date and a sequential counter.
 * Format: PREFIX + YYYYMMDD + COUNT (e.g., QZ2023102701)
 * 
 * @param model - The Mongoose model to query for existing documents count
 * @param prefix - The prefix for the ID (default: 'QZ')
 * @returns A promise that resolves to the generated booking ID
 */
export const generateBookingId = async (model: Model<any>, prefix: string = 'QZ'): Promise<string> => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Count documents created since the start of today
    const count = await model.countDocuments({
        createdAt: { $gte: startOfDay }
    });

    const timestamp = Date.now().toString();
    const countStr = (count + 1).toString().padStart(2, '0');

    return `${prefix}${timestamp}${countStr}`;
};
