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
            totalBrands,
            revenueResult,
            hoursResult
        ] = await Promise.all([
            Order.countDocuments({ status: { $ne: RideStatus.DELETED } }),
            Order.countDocuments({ status: RideStatus.NEW }),
            Order.countDocuments({ status: RideStatus.APPROVE }), // Confirmed
            Order.countDocuments({ status: RideStatus.RIDE_COMPLETED }),
            Order.countDocuments({ status: RideStatus.CANCEL }),
            Car.countDocuments({ status: { $ne: 0 } }), // Assuming 0 is deleted
            Car.countDocuments({ status: status.active }),
            Brand.countDocuments({ status: { $ne: 0 } }),
            Order.aggregate([
                {
                    $match: {
                        status: RideStatus.RIDE_COMPLETED,
                        $or: [
                            { selectedPackage: { $exists: true, $regex: "₹" } },
                            { finalPrice: { $exists: true, $ne: null } }
                        ]
                    }
                },
                {
                    $project: {
                        revenue: {
                            $cond: {
                                if: { $ifNull: ["$finalPrice", false] },
                                then: "$finalPrice",
                                else: {
                                    $toInt: {
                                        $replaceAll: {
                                            input: { $arrayElemAt: [{ $split: ["$selectedPackage", "₹"] }, -1] },
                                            find: ",",
                                            replacement: ""
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$revenue" }
                    }
                }
            ]),
            Order.aggregate([
                {
                    $match: {
                        status: RideStatus.RIDE_COMPLETED,
                        selectedPackage: { $exists: true }
                    }
                },
                {
                    $project: {
                        hours: {
                            $toInt: { $arrayElemAt: [{ $split: ["$selectedPackage", " "] }, 0] }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalHours: { $sum: "$hours" }
                    }
                }
            ])
        ]);

        const totalRevenue = revenueResult[0]?.totalRevenue || 0;
        const totalHours = hoursResult[0]?.totalHours || 0;

        res.json({
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                confirmed: confirmedOrders,
                completed: completedOrders,
                cancelled: cancelledOrders
            },
            revenue: {
                total: totalRevenue
            },
            hours: {
                total: totalHours
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

        const [monthlyTrend, statusDistribution, popularCars, carsByBrand, revenueByCar, revenueTrend, hoursTrend] = await Promise.all([
            // ... (previous aggregations)

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
            ]),

            // 5. Revenue by Car (Top 5)
            Order.aggregate([
                {
                    $match: {
                        ...trendMatch,
                        status: RideStatus.RIDE_COMPLETED,
                        $or: [
                            { selectedPackage: { $exists: true, $regex: "₹" } },
                            { finalPrice: { $exists: true, $ne: null } }
                        ]
                    }
                },
                {
                    $project: {
                        carName: 1,
                        revenue: {
                            $cond: {
                                if: { $ifNull: ["$finalPrice", false] },
                                then: "$finalPrice",
                                else: {
                                    $toInt: {
                                        $replaceAll: {
                                            input: { $arrayElemAt: [{ $split: ["$selectedPackage", "₹"] }, -1] },
                                            find: ",",
                                            replacement: ""
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: "$carName",
                        totalRevenue: { $sum: "$revenue" }
                    }
                },
                { $sort: { totalRevenue: -1 } },
                { $limit: 5 }
            ]),

            // 6. Revenue Trend
            Order.aggregate([
                {
                    $match: {
                        ...trendMatch,
                        status: RideStatus.RIDE_COMPLETED,
                        $or: [
                            { selectedPackage: { $exists: true, $regex: "₹" } },
                            { finalPrice: { $exists: true, $ne: null } }
                        ]
                    }
                },
                {
                    $project: {
                        createdAt: 1,
                        revenue: {
                            $cond: {
                                if: { $ifNull: ["$finalPrice", false] },
                                then: "$finalPrice",
                                else: {
                                    $toInt: {
                                        $replaceAll: {
                                            input: { $arrayElemAt: [{ $split: ["$selectedPackage", "₹"] }, -1] },
                                            find: ",",
                                            replacement: ""
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: trendGroup,
                        totalRevenue: { $sum: "$revenue" }
                    }
                },
                { $sort: trendSort }
            ]),

            // 7. Hours Trend
            Order.aggregate([
                {
                    $match: {
                        ...trendMatch,
                        status: RideStatus.RIDE_COMPLETED,
                        selectedPackage: { $exists: true }
                    }
                },
                {
                    $project: {
                        createdAt: 1,
                        hours: {
                            $toInt: { $arrayElemAt: [{ $split: ["$selectedPackage", " "] }, 0] }
                        }
                    }
                },
                {
                    $group: {
                        _id: trendGroup,
                        totalHours: { $sum: "$hours" }
                    }
                },
                { $sort: trendSort }
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
            revenueTrend: revenueTrend.map(item => {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                if (period === 'weekly') {
                    return { label: `${months[item._id.month - 1]} ${item._id.day}`, revenue: item.totalRevenue };
                } else if (period === 'yearly') {
                    return { label: `${item._id.year}`, revenue: item.totalRevenue };
                } else {
                    return { label: `${months[item._id.month - 1]} ${item._id.year}`, revenue: item.totalRevenue };
                }
            }),
            hoursTrend: hoursTrend.map(item => {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                if (period === 'weekly') {
                    return { label: `${months[item._id.month - 1]} ${item._id.day}`, hours: item.totalHours };
                } else if (period === 'yearly') {
                    return { label: `${item._id.year}`, hours: item.totalHours };
                } else {
                    return { label: `${months[item._id.month - 1]} ${item._id.year}`, hours: item.totalHours };
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
            })),
            revenueByCar: (revenueByCar || []).map((item: any) => ({
                name: item._id || 'Unknown',
                revenue: item.totalRevenue
            }))
        });
    } catch (error: any) {
        console.error('Get Dashboard Analytics Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Specific Chart Data
// @route   GET /api/dashboard/chart-data
// @access  Private/Admin
export const getDashboardChartData = async (req: Request, res: Response) => {
    try {
        const { type, period } = req.query;
        let trendMatch: any = { status: { $ne: RideStatus.DELETED } };
        let trendGroup: any = {};
        let trendSort: any = {};

        const now = new Date();
        let aggregationPipeline: any[] = [];

        // 1. Period Logic
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
            trendGroup = { year: { $year: "$createdAt" } };
            trendSort = { "_id.year": 1 };
        } else {
            // Monthly
            const last12Months = new Date();
            last12Months.setMonth(now.getMonth() - 12);
            trendMatch.createdAt = { $gte: last12Months };
            trendGroup = { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } };
            trendSort = { "_id.year": 1, "_id.month": 1 };
        }

        // 2. Type Logic
        if (type === 'orders') {
            aggregationPipeline = [
                { $match: trendMatch },
                { $group: { _id: trendGroup, count: { $sum: 1 } } },
                { $sort: trendSort }
            ];
        } else if (type === 'revenue') {
            aggregationPipeline = [
                {
                    $match: {
                        ...trendMatch,
                        status: RideStatus.RIDE_COMPLETED,
                        $or: [
                            { selectedPackage: { $exists: true, $regex: "₹" } },
                            { finalPrice: { $exists: true, $ne: null } }
                        ]
                    }
                },
                {
                    $project: {
                        createdAt: 1,
                        revenue: {
                            $cond: {
                                if: { $ifNull: ["$finalPrice", false] },
                                then: "$finalPrice",
                                else: {
                                    $toInt: {
                                        $replaceAll: {
                                            input: { $arrayElemAt: [{ $split: ["$selectedPackage", "₹"] }, -1] },
                                            find: ",",
                                            replacement: ""
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                { $group: { _id: trendGroup, total: { $sum: "$revenue" } } },
                { $sort: trendSort }
            ];
        } else if (type === 'hours') {
            aggregationPipeline = [
                {
                    $match: {
                        ...trendMatch,
                        status: RideStatus.RIDE_COMPLETED,
                        selectedPackage: { $exists: true }
                    }
                },
                {
                    $project: {
                        createdAt: 1,
                        hours: {
                            $toInt: { $arrayElemAt: [{ $split: ["$selectedPackage", " "] }, 0] }
                        }
                    }
                },
                { $group: { _id: trendGroup, total: { $sum: "$hours" } } },
                { $sort: trendSort }
            ];
        }

        const result = await Order.aggregate(aggregationPipeline);

        // 3. Format Response
        const formattedData = result.map(item => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let label = "";

            if (period === 'weekly') {
                label = `${months[item._id.month - 1]} ${item._id.day}`;
            } else if (period === 'yearly') {
                label = `${item._id.year}`;
            } else {
                label = `${months[item._id.month - 1]} ${item._id.year}`;
            }

            if (type === 'orders') return { label, bookings: item.count };
            if (type === 'revenue') return { label, revenue: item.total };
            if (type === 'hours') return { label, hours: item.total };
            return { label, value: 0 };
        });

        res.json({ data: formattedData });

    } catch (error: any) {
        console.error('Get Chart Data Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
