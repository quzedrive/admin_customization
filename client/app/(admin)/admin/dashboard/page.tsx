'use client';

import React from 'react';
import { useAdminLoginQueries } from '@/lib/hooks/queries/useAdminLoginQueries';
import {
  Building2,
  CheckCircle2,
  XCircle,
  FolderOpen,
  ClipboardList,
  MessageSquare,
  TrendingUp,
  Users,
  RefreshCcw // Import Refresh icon
} from 'lucide-react';
import { cn } from '@/components/utils/cn';

function AdminDashboardPage() {
  const { data, refetch, isRefetching } = useAdminLoginQueries();

  const stats = [
    // ... stats array
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, <span className="font-semibold text-gray-700">{data?.admin?.username || 'Admin'}</span></p>
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
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
            </div>
            <div className={cn("p-3 rounded-xl", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Growth Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Property Growth
            </h3>
            <p className="text-sm text-gray-500 mt-1">New properties added over time</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg self-start">
            {['7 Days', 'Monthly', 'Yearly'].map((filter, i) => (
              <button
                key={filter}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                  i === 0 ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-gray-100 pb-0">
          {[40, 70, 45, 90, 60, 80, 50, 65, 85, 95, 75, 60].map((h, i) => (
            <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group h-full flex flex-col justify-end">
              <div
                style={{ height: `${h}%` }}
                className="w-full bg-blue-500/10 group-hover:bg-blue-500/20 rounded-t-sm transition-all relative"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-4 px-2">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;