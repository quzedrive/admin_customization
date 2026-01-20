import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export const queryKeys = {
    admin: {
        me: 'adminMe',
    },
    dashboard: {
        stats: 'dashboardStats',
        analytics: 'dashboardAnalytics',
    },
    brand: {
        adminList: 'adminBrandList',
        publicList: 'publicBrandList',
    },
    package: {
        adminList: 'adminPackageList',
        publicList: 'publicPackageList',
    },
    siteSettings: 'site-settings',
    emailConfig: 'email-config',
    imageUploadConfig: 'image-upload-config',
    appearanceSettings: 'appearance-settings',
    systemTemplates: 'system-templates',
    cars: {
        adminList: 'cars-admin-list',
        publicList: 'cars-public-list',
        detail: 'car-detail',
        featured: 'cars-featured',
    },
    cancellationReasons: {
        list: 'cancellationReasonList',
        detail: 'cancellationReasonDetail',
    },
    orders: {
        adminList: 'adminOrderList',
        tracking: 'trackOrder',
    },
    notifications: {
        all: 'allNotifications',
    },
};
