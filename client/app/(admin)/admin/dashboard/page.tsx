'use client';

import React from 'react';
import { useAdminLoginQueries } from '@/lib/hooks/queries/useAdminLoginQueries';
import { useDashboardQueries } from '@/lib/hooks/queries/useDashboardQueries';
import {
  Building2,
  CheckCircle2,
  XCircle,
  FolderOpen,
  ClipboardList,
  MessageSquare,
  TrendingUp,
  Users,
  RefreshCcw,
  Car,
  Tags
} from 'lucide-react';
import { cn } from '@/components/utils/cn';
import Link from 'next/link';
import { useDashboardAnalytics } from '@/lib/hooks/queries/useDashboardQueries';
import OrdersTrendChart from '@/components/admin/dashboard/OrdersTrendChart';
import OrderStatusChart from '@/components/admin/dashboard/OrderStatusChart';
import PopularCarsChart from '@/components/admin/dashboard/PopularCarsChart';
import BrandDistributionChart from '@/components/admin/dashboard/BrandDistributionChart';


function AdminDashboardPage() {
  const [period, setPeriod] = React.useState('monthly');
  const { data: adminData } = useAdminLoginQueries();
  const { stats, refetch, isRefetching, isLoading } = useDashboardQueries();
  const { analytics, isLoading: analyticsLoading } = useDashboardAnalytics(period);

  const statCards = [
    {
      label: 'Total Bookings',
      value: stats?.orders?.total || 0,
      icon: ClipboardList,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      link: '/admin/order-management/list-page'
    },
    {
      label: 'Completed Rides',
      value: stats?.orders?.completed || 0,
      icon: CheckCircle2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      link: '/admin/order-management/list-page' // Assuming 5 is RIDE_COMPLETED
    },
    {
      label: 'Active Cars',
      value: stats?.cars?.active || 0,
      icon: Car,
      color: 'text-green-600',
      bg: 'bg-green-50',
      link: '/admin/cars-management/list-page'
    },
    {
      label: 'Brands',
      value: stats?.brands?.total || 0,
      icon: Tags,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      link: '/admin/brand-management/list-page'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, <span className="font-semibold text-gray-700">{adminData?.admin?.username || 'Admin'}</span></p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          title="Refresh Data"
        >
          <RefreshCcw className={cn("w-5 h-5", isRefetching && "animate-spin text-blue-600")} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Link href={stat.link}   key={idx} className="block group">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between transition-all hover:-translate-y-1 hover:shadow-md h-full">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {isLoading ? '...' : stat.value}
                </h3>
              </div>
              <div className={cn("p-3 rounded-xl transition-colors group-hover:bg-opacity-80", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Analytics Charts Section */}
      <div className="space-y-6">
        {/* Row 1: Trends */}
        <div className="h-[400px]">
          {analyticsLoading ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex items-center justify-center text-gray-400">Loading Trends...</div>
          ) : (
            <OrdersTrendChart
              data={analytics?.trend || []}
              period={period}
              onFilterChange={setPeriod}
            />
          )}
        </div>

        {/* Row 2: Status, Brand, Top Cars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analyticsLoading ? (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex items-center justify-center text-gray-400">Loading Status...</div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex items-center justify-center text-gray-400">Loading Brands...</div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] lg:col-span-2 flex items-center justify-center text-gray-400">Loading Cars...</div>
            </>
          ) : (
            <>
              <div className="h-[400px]">
                <OrderStatusChart data={analytics?.statusDistribution || []} />
              </div>
              <div className="h-[400px]">
                <BrandDistributionChart data={analytics?.carsByBrand || []} />
              </div>
              <div className="lg:col-span-2">
                <PopularCarsChart data={analytics?.popularCars || []} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;