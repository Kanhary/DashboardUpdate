import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";

const Header_page = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const handleDropdownToggle = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Example, adjust based on your auth setup
    navigate('/'); // Redirect to login page
  };

  return (
    <nav className='fixed top-0 z-50 w-full bg-white border border-b-gray-200'>
      <div className='px-3 py-3 lg:px-5 lg:pl-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-start justify-normal rtl:justify-end'>
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
              <span className="self-center text-xl font-meduim sm:text-xl whitespace-nowrap font-khmer">ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យកុំព្យូទ័រ</span>
            </a>
          </div>
          <div className='relative flex items-center ms-3'>
          <button 
              className="relative mr-5 text-gray-600 hover:text-gray-800" 
              onClick={handleNotificationsToggle}
            >
              <FiBell size={24} />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                3
              </span>
            </button>

            {isNotificationsOpen && (
              <div className='absolute z-50 w-64 mt-2 text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg right-16 top-full'>
                <div className='px-4 py-3 text-gray-900'>
                  <p className='font-semibold'>Notifications</p>
                </div>
                <ul className="py-1">
                  <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    New employee added
                  </li>
                  <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    System update available
                  </li>
                  <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Server backup completed
                  </li>
                </ul>
              </div>
            )}
            <button 
              type='button' 
              className='flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 ' 
              aria-expanded={isDropdownOpen ? "true" : "false"} 
              onClick={handleDropdownToggle}
            >
              <span className='sr-only'>Open user menu</span>
              <img src="/User.jpg" className='w-8 h-8 rounded-full' alt="User Photo" />
            </button>
            {isDropdownOpen && (
              <div className='absolute right-0 z-50 w-48 mt-2 text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg top-full '>
                <div className='px-4 py-3'>
                  <p className='text-gray-900 text-ms '>Uk Kagnary</p>
                  <p className='text-sm font-medium text-gray-900 truncate '>ukkanhary04@gmail.com</p>
                </div>
                <ul className="py-1">
                  <li>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 " onClick={handleLogout}>Sign out</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header_page;
