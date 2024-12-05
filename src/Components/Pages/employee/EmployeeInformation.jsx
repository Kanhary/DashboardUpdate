import React, { useState } from 'react';
import StaffInfo from './StaffInfo';
import EmployeeChild from './EmployeeChild';
import StaffWifeInfo from './StaffWifeInfo';
import ComputerCourse from './ComputerCourse';



const EmployeeInformation = () => {
  const [activeTab, setActiveTab] = useState('Staff');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6 mt-10 rounded-lg shadow-md">
      {/* Page Header */}
      <h1 className='text-xl font-medium text-blue-800'>Staff</h1>
      <div className='mt-3 border'></div>
      {/* Tab Menu */}
      <div className="flex gap-4 mb-6 border-b ">
        {['Staff', 'Child', 'Wife', 'Computer Course'].map((tab) => (
          <button
            key={tab}
            className={`px-5 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-blue-500 hover:border-gray-300'
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'Staff' && <StaffInfo/>}
        {activeTab === 'Child' && <EmployeeChild/>}
        {activeTab === 'Wife' && <StaffWifeInfo/>}
        {activeTab === 'Computer Course' && <ComputerCourse/>}
      </div>
    </div>
  );
};

export default EmployeeInformation;
