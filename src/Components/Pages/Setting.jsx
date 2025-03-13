import React, { useState } from 'react';
import { FiLock } from 'react-icons/fi';

const Setting = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }
    // Handle password change logic here (API call, validation, etc.)
    alert("Password changed successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Change Password</h1>

        <form onSubmit={handleChangePassword}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Current Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
              <FiLock className="w-5 h-5 text-blue-600 mr-3" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full bg-transparent outline-none"
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">New Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
              <FiLock className="w-5 h-5 text-blue-600 mr-3" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-transparent outline-none"
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Confirm New Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
              <FiLock className="w-5 h-5 text-blue-600 mr-3" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-transparent outline-none"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;
