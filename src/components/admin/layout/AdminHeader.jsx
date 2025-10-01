import React from 'react';

const AdminHeader = ({ admin, onLogout }) => {
  return (
    <header className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-white">TalentRanker Admin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">
              Welcome, {admin?.name || 'Admin'}
            </span>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;