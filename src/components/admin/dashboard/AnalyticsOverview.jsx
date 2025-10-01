import React from 'react';

const AnalyticsOverview = ({ dashboardStats }) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Analytics</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total JDs Processed</span>
                <span className="text-sm font-medium text-gray-900">
                  {dashboardStats.totalJDsProcessed || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total CVs Processed</span>
                <span className="text-sm font-medium text-gray-900">
                  {dashboardStats.totalCVsProcessed || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">API Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Operational
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Update</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;