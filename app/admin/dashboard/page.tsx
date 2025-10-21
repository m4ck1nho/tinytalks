'use client';

import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your TinyTalks admin panel</p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
}

