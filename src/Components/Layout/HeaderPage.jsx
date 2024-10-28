import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { BiBell } from "react-icons/bi";
import { GetUserLogin } from '../../api/user'; 
import { FaUpload } from 'react-icons/fa'; // Import the upload icon
import Swal from 'sweetalert2'; // Import SweetAlert2

const HeaderPage = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const navigate = useNavigate();
  const [currentProfileImage, setCurrentProfileImage] = useState(avatar); // Replace with actual image URL

  
  const notificationsRef = useRef(null);

  useEffect(() => {
    GetUserLogin()
      .then(res => {
        setUsername(res.data.data.username);
        setAvatar(res.data.data.avatar);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });

    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  
  const handleDropdownToggle = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(prev => !prev);
  };

  const handleEditProfile = (e) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Update profile image preview
      };
      reader.readAsDataURL(file); // Read the new image
      setNewProfileImage(file); // Set the new profile image
    }
  };
  
  const handleSaveProfileImage = () => {
    // This code remains unchanged
    if (newProfileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the profile image state and local storage
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
      };
      reader.readAsDataURL(newProfileImage); // Read the new image
    }
    // Close the modal
    setIsEditModalOpen(false);
    Swal.fire({
      title: 'Success!',
      text: 'Your Profile Upload Success!',
      icon: 'success',
      confirmButtonText: 'Okay',
      // Optionally, you can customize the buttons, colors, and more
    }).then(() => {
      setIsEditModalOpen(false); // Close the modal after alert
    });
  };
  
  const handleLogout = (e) => {
    e.stopPropagation(); 
    localStorage.removeItem("userToken"); 
    navigate("/");
  };

  return (
    <div>
      <nav className='fixed top-0 z-50 w-full bg-white border border-b-gray-200'>
      <div className='px-3 py-3 lg:px-5 lg:pl-3'>
        <div className='flex items-center justify-between'>
          {/* Sidebar Toggle Button */}
          <div className='flex items-start justify-normal rtl:justify-end w-80'>
            <button 
              data-drawer-target="logo-sidebar" 
              data-drawer-toggle="logo-sidebar" 
              aria-controls="logo-sidebar" 
              type="button" 
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
              </svg>
            </button>
            <a href="#" className="flex ms-2 md:me-24">
              <img src='/LOGO PPAP.png' className="h-8 me-3" alt="PPAP Logo" />
              <span className="self-center text-base font-medium sm:text-xl whitespace-nowrap font-khmer">ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យកុំព្យូទ័រ</span>
            </a>
          </div>

          {/* Notifications and Profile */}
          <div className='relative flex items-center ms-3'>
            <button 
              className="relative mr-5 text-gray-600 hover:text-gray-800" 
              onClick={handleNotificationsToggle}
              ref={notificationsRef}
            >
              <BiBell size={24} />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                3
              </span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute z-50 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg w-72 right-16 top-full font-khmer">
                <div className="px-5 py-3 bg-gray-100 border-b border-gray-200">
                  <p className="flex items-center font-medium text-gray-900">
                    <BiBell size={20} className="mr-2 text-indigo-500" />
                    Notification
                  </p>
                </div>

                <ul className="divide-y divide-gray-200">
                  <li className="flex items-center px-4 py-3 transition-colors hover:bg-gray-50">
                    <div className="flex-shrink-0 w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                    <div className="ml-3 text-sm text-gray-700">
                      New employee added
                      <p className="text-xs text-gray-500 mt-0.5">Just now</p>
                    </div>
                  </li>
                  <li className="flex items-center px-4 py-3 transition-colors hover:bg-gray-50">
                    <div className="flex-shrink-0 w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                    <div className="ml-3 text-sm text-gray-700">
                      System update available
                      <p className="text-xs text-gray-500 mt-0.5">5 minutes ago</p>
                    </div>
                  </li>
                  <li className="flex items-center px-4 py-3 transition-colors hover:bg-gray-50">
                    <div className="flex-shrink-0 w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    <div className="ml-3 text-sm text-gray-700">
                      Server backup completed
                      <p className="text-xs text-gray-500 mt-0.5">1 hour ago</p>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            {/* Profile Dropdown */}
            <button 
              type='button' 
              className='flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 ' 
              aria-expanded={isDropdownOpen ? "true" : "false"} 
              onClick={handleDropdownToggle}
            >
              <span className='sr-only'>Open user menu</span>
              <img src={avatar || "/blank-profile-picture.png"} className="w-8 h-8 rounded-full sm:w-12 sm:h-10 md:w-8 md:h-8 lg:w-8 lg:h-8" alt="User Photo" />
            </button>

            {isDropdownOpen && (
              <div className='absolute right-0 z-50 w-64 mt-2 text-base list-none bg-white border divide-y divide-gray-300 rounded shadow-lg top-full font-khmer'>
                <div className='px-4 py-3'>
                {/* <img src={avatar || "/blank-profile-picture.png"} className="w-10 h-10 rounded-lg sm:w-15 sm:h-14 md:w-10 md:h-10 lg:w-16 lg:h-16" alt="User Photo" /> */}
                  <p className='flex justify-center font-normal text-gray-900 text-ms'>Welcome, {username}!</p>
                  <p className='py-1 text-sm font-medium text-gray-400 truncate'>{userEmail}</p>
                </div>
                <ul className="py-1">
                  <li>
                    <button className="block w-full px-4 py-2 text-sm text-blue-700 hover:bg-blue-100" onClick={handleEditProfile}>
                      Edit Profile
                    </button>
                  </li>
                  <li>
                    <button className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 " onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    {isEditModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60">
    <div className="w-full max-w-md p-6 transition-all transform bg-white rounded-lg shadow-xl">
      <h3 className="flex justify-center mb-4 text-2xl font-semibold text-gray-800">Edit Image</h3>

      {/* Display Profile Image (Current or New) */}
      <div className="flex justify-center mb-4">
        <img 
          src={newProfileImage ? URL.createObjectURL(newProfileImage) : avatar} 
          alt="Profile" 
          className="object-cover border-4 border-blue-500 rounded-full shadow-md w-52 h-52"
        />
      </div>

      {/* File Input */}
      <label className="flex justify-center block mb-4">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="hidden" // Hide the input
          id="file-input" // Give it an ID for the label to reference
        />
        <span className="inline-flex items-center px-4 py-2 mt-4 text-sm text-white bg-blue-600 rounded-full cursor-pointer w-42 hover:bg-blue-700">
          <p>Upload Image</p>
          <FaUpload className="ml-4" /> {/* Upload icon */}
        </span>
      </label>

      {/* Action Buttons */}
      <div className="flex justify-end mt-8 space-x-3">
        <button 
          className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSaveProfileImage}
        >
          Save
        </button>
        <button 
          className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={() => setIsEditModalOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default HeaderPage;
