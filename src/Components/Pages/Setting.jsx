import React, { useState, useEffect } from 'react';
import { FiLock } from 'react-icons/fi';
import { ChangePwd, GetUserLogin } from '../../api/user';
import Swal from "sweetalert2";
import axios from 'axios';

const Setting = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  // const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    newPassword: ''
  });
  
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }
    // Handle password change logic here (API call, validation, etc.)
    alert("Password changed successfully!");
  };


  useEffect(() => {
      
      const fetchCurrentUser = async () => {
        try {
          const response = await GetUserLogin();
          setCurrentUser(response.data.data.id); // Assuming the response contains a username field
          console.log("Fetched user:", response.data.data.id);
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      };

      fetchCurrentUser();
    }, []);

    const handleSave = async (e) => {
      e.preventDefault(); // Prevent page refresh
    
      // Prepare the data for submission
      // const updatedFormData = {
      //   userId: currentUser,
      //   newPassword: formData.newPassword
      // };
    
      try {
        // Call your API to save the data
        const response = axios.post(`http://192.168.100.55:8759/user/change-password`,
          new URLSearchParams({
            userId: currentUser,
            newPassword: formData.newPassword
        }),
       {
          // method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          // body: JSON.stringify(updatedFormData),
        });
    
        // Show success alert
        Swal.fire({
          title: "Saved!",
          text: "Password changed successfully.",
          icon: "success",
          confirmButtonText: "Okay",
        });
    
        console.log("API Response:", await response.json());
      } catch (error) {
        console.error("Error saving data", error);
    
        // Show error alert if something goes wrong
        Swal.fire({
          title: "Error!",
          text: "Failed to change password.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    };
    

      const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
      };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Change Password</h1>

        <form>
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
                id='newPassword'
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSave}
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
