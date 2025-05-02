import React, { useState } from 'react';
import StaffInfo from './StaffInfo';
import EmployeeChild from './EmployeeChild';
import StaffWifeInfo from './StaffWifeInfo';
import ComputerCourse from './ComputerCourse';



const EmployeeInformation = () => {
  const [activeTab, setActiveTab] = useState('បុគ្គលិក');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className=" mt-10 rounded-lg">
      {/* Page Header */}
      <h1 className='text-md font-medium text-blue-800'>តារាងបុគ្គលិក</h1>
      <div className='mt-3 border'></div>
      {/* Tab Menu */}
      <div className="flex gap-4 mb-6 border-b ">
        {['បុគ្គលិក', 'Child', 'Wife', 'Computer Course'].map((tab) => (
          <button
            key={tab}
            className={`px-5 py-2 text-[12px] font-medium transition-all duration-200 border-b-2 ${
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
      <div className="">
        {activeTab === 'បុគ្គលិក' && <StaffInfo/>}
        {activeTab === 'Child' && <EmployeeChild/>}
        {activeTab === 'Wife' && <StaffWifeInfo/>}
        {activeTab === 'Computer Course' && <ComputerCourse/>}
      </div>
    </div>
  );
};

export default EmployeeInformation;
