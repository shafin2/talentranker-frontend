import React from 'react';
import UserTable from './UserTable';
import UserSearch from './UserSearch';

const UsersManagement = ({ 
  users, 
  userSearch, 
  setUserSearch, 
  onRefresh,
  onEditUser,
  onDeleteUser,
  onChangePlan
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">User Management</h1>
        <button
          onClick={onRefresh}
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      <UserSearch 
        userSearch={userSearch} 
        setUserSearch={setUserSearch} 
      />

      <UserTable 
        users={users}
        onEditUser={onEditUser}
        onDeleteUser={onDeleteUser}
        onChangePlan={onChangePlan}
      />
    </div>
  );
};

export default UsersManagement;