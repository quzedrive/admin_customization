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
        adminList: 'adminCarList',
        publicList: 'publicCarList',
        detail: 'carDetail',
    },
    cancellationReasons: {
        list: 'cancellationReasonList',
        detail: 'cancellationReasonDetail',
    },
    orders: {
        adminList: 'adminOrderList',
    },
};
