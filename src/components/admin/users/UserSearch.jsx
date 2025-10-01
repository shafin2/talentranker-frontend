import React from 'react';

const UserSearch = ({ userSearch, setUserSearch }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search users..."
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
      />
    </div>
  );
};

export default UserSearch;