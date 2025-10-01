import React from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children, activeTab, setActiveTab, admin, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <AdminHeader admin={admin} onLogout={onLogout} />
      
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;