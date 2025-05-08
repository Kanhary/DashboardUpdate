import React, { useState, useEffect } from 'react';
import { FiLock } from 'react-icons/fi';
import { ChangePwd, GetUserLogin } from '../../api/user';
import Swal from "sweetalert2";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Setting = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    newPassword: ''
  });

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match!"); // Using Toast for error
      return;
    }
    // Handle password change logic here (API call, validation, etc.)
    toast.success("Password changed successfully!"); // Using Toast for success
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
    
    try {
      // Call your API to save the data
      const response = await axios.post(
        `http://192.168.168.4:8759/user/change-password`,
        new URLSearchParams({
          userId: currentUser,
          newPassword: formData.newPassword
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Show success toast
      toast.success("Change password successfully!", {
        position: "top-left",
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light"
      });
      
      console.log("API Response:", await response.data);
    } catch (error) {
      console.error("Error saving data", error);

      // Show error toast
      toast.error("Change password fail!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light"
      });
      
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8 ">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-medium text-blue-900 mb-6 text-center">ផ្លាស់ប្តូរពាក្យសម្ងាត់</h1>

        <form>
          <div className="mb-6 text-[14px]">
            <label className="block text-gray-700 mb-2 font-medium">Current Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
              <FiLock className="w-4 h-4 text-blue-600 mr-3" />
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

          <div className="mb-6 text-[14px]">
            <label className="block text-gray-700 mb-2 font-medium">New Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
              <FiLock className="w-4 h-4 text-blue-600 mr-3" />
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

          <div className="mb-6 text-[14px]">
            <label className="block text-gray-700 mb-2 font-medium">Confirm New Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
              <FiLock className="w-4 h-4 text-blue-600 mr-3" />
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
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 text-[14px] font-bold"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* ToastContainer for displaying the Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default Setting;
