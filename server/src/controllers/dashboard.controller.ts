import { Request, Response } from 'express';
import Order from '../models/form-submissions/order.model';
import Car from '../models/cars/car.model';
import Brand from '../models/brand.model';
import { RideStatus } from '../constants/ride';
import { status } from '../constants/status';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [
            totalOrders,
            pendingOrders,
            confirmedOrders,
            completedOrders,
            cancelledOrders,
            totalCars,
            activeCars,
            totalBrands
        ] = await Promise.all([
            Order.countDocuments({ status: { $ne: RideStatus.DELETED } }),
            Order.countDocuments({ status: RideStatus.NEW }),
            Order.countDocuments({ status: RideStatus.APPROVE }), // Confirmed
            Order.countDocuments({ status: RideStatus.RIDE_COMPLETED }),
            Order.countDocuments({ status: RideStatus.CANCEL }),
            Car.countDocuments({ status: { $ne: 0 } }), // Assuming 0 is deleted
            Car.countDocuments({ status: status.active }),
            Brand.countDocuments({ status: { $ne: 0 } })
        ]);

        res.json({
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                confirmed: confirmedOrders,
                completed: completedOrders,
                cancelled: cancelledOrders
            },
            cars: {
                total: totalCars,
                active: activeCars
            },
            brands: {
                total: totalBrands
            }
        });
    } catch (error: any) {
        console.error('Get Dashboard Stats Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Dashboard Analytics (Charts)
// @route   GET /api/dashboard/analytics
// @access  Private/Admin
export const getDashboardAnalytics = async (req: Request, res: Response) => {
    try {
        const { period } = req.query;
        let trendMatch: any = { status: { $ne: RideStatus.DELETED } };
        let trendGroup: any = {};
        let trendSort: any = {};
        let dateFormat: string = ''; // For frontend mapping logic if needed, or handled below

        const now = new Date();

        if (period === 'weekly') {
            const last7Days = new Date();
            last7Days.setDate(now.getDate() - 7);
            trendMatch.createdAt = { $gte: last7Days };
            trendGroup = {
                day: { $dayOfMonth: "$createdAt" },
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" }
            };
            trendSort = { "_id.year": 1, "_id.month": 1, "_id.day": 1 };
        } else if (period === 'yearly') {
            const last5Years = new Date();
            last5Years.setFullYear(now.getFullYear() - 5);
            trendMatch.createdAt = { $gte: last5Years };
            trendGroup = {
                year: { $year: "$createdAt" }
            };
            trendSort = { "_id.year": 1 };
        } else {
            // Default to Monthly (Last 12 Months)
            const last12Months = new Date();
            last12Months.setMonth(now.getMonth() - 12);
            trendMatch.createdAt = { $gte: last12Months };
            trendGroup = {
                month: { $month: "$createdAt" },
                year: { $year: "$createdAt" }
            };
            trendSort = { "_id.year": 1, "_id.month": 1 };
        }

        const [monthlyTrend, statusDistribution, popularCars, carsByBrand] = await Promise.all([
            // 1. Order Trend (Filtered)
            Order.aggregate([
                { $match: trendMatch },
                {
                    $group: {
                        _id: trendGroup,
                        count: { $sum: 1 }
                    }
                },
                { $sort: trendSort }
            ]),

            // 2. Status Distribution
            Order.aggregate([
                { $match: { status: { $ne: RideStatus.DELETED } } },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // 3. Popular Cars (Top 5)
            Order.aggregate([
                { $match: { status: { $ne: RideStatus.DELETED } } },
                {
                    $group: {
                        _id: "$carName",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]),

            // 4. Cars by Brand (Brand Wise Selection)
            Order.aggregate([
                { $match: { status: { $ne: RideStatus.DELETED }, carSlug: { $exists: true, $ne: '' } } },
                {
                    $lookup: {
                        from: "cars",
                        localField: "carSlug",
                        foreignField: "slug",
                        as: "carDetails"
                    }
                },
                { $unwind: "$carDetails" },
                {
                    $group: {
                        _id: "$carDetails.brand",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ])
        ]);


        res.json({
            trend: monthlyTrend.map(item => {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                if (period === 'weekly') {
                    return { label: `${months[item._id.month - 1]} ${item._id.day}`, bookings: item.count };
                } else if (period === 'yearly') {
                    return { label: `${item._id.year}`, bookings: item.count };
                } else {
                    return { label: `${months[item._id.month - 1]} ${item._id.year}`, bookings: item.count };
                }
            }),
            statusDistribution: statusDistribution.map(item => ({
                status: item._id,
                count: item.count
            })),
            popularCars: popularCars.map(item => ({
                name: item._id || 'Unknown',
                bookings: item.count
            })),
            carsByBrand: carsByBrand.map(item => ({
                name: item._id || 'Unknown',
                value: item.count
            }))
        });
    } catch (error: any) {
        console.error('Get Dashboard Analytics Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
