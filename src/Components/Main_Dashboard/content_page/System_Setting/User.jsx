import React, { useState } from 'react';
import { FaPen, FaTrashAlt } from "react-icons/fa";

const User = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', position: '' });
  const [editingGender, setEditingGender] = useState(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const users = [
    { code: 'admin123', username: 'admin', firstname: 'Uk', lastname: 'Kagnary', phoneNumber: '0988767543', email: 'admin@gmail.com' }, 
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const filteredGender = users.filter(user =>
    user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.code.includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredGender.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentGenders = filteredGender.slice(indexOfFirstRecord, indexOfLastRecord);

  const getPaginationItems = () => {
    let pages = [];
    if (totalPages <= 7) {
      pages = [...Array(totalPages)].map((_, index) => index + 1);
    } else {
      if (currentPage < 4) {
        pages = [1, 2, 3, 4, '...', totalPages];
      } else if (currentPage > totalPages - 3) {
        pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }
    return pages;
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (code, username, firstname, lastname, phoneNumber, email) => {
    setEditingGender({ code, username, firstname, lastname, phoneNumber, email });
    setFormData({ code, username, firstname, lastname, phoneNumber, email });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingGender(null);
    setFormData({ code: '', username: '', firstname: '', lastname: '', phoneNumber: '', email: '' });
    setIsEditModalOpen(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveNew = () => {
    console.log('Save & New clicked', formData);
    setFormData({ code: '', username: '', firstname: '', lastname: '', phoneNumber: '', email: '' });
  };

  const handleSave = () => {
    console.log('Save clicked', formData);
    closeAddModal();
  };

  const handleUpdate = () => {
    console.log('Update clicked', formData);
    closeEditModal();
  };

  const deleteGender = (code) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      // Your delete logic here...
    }
  };

  return (
    <section className='mt-10 font-khmer'>
      <h1 className='text-xl font-medium text-blue-800'>អ្នកប្រើប្រាស់</h1>
      <div className='mt-3 border'></div>
      <div className='w-full mt-4'>
        <div className='relative w-full overflow-hidden bg-white shadow-md sm:rounded-lg'>
          <div className='flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4'>
            <div className='w-full md:w-1/2'>
              <form className='flex items-center'>
                <label htmlFor="simple-search" className='sr-only'>Search</label>
                <div className='relative w-full'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id='simple-search'
                    className='block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 '
                    placeholder='ស្វែងរក'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required=""
                  />
                </div>
              </form>
            </div>
            <div className='flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3'>
              <button
                type='button'
                className='flex items-center justify-center px-5 py-2 text-lg font-medium text-white transition-transform transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 hover:scale-105 active:scale-95'
                onClick={openAddModal}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                បន្ថែម
              </button>
            </div>
          </div>
          
          <div className='w-full overflow-x-auto'>
            <table className='w-full text-sm text-left text-gray-500 '>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
                <tr>
                  <th scope="col" className="sticky left-0 px-4 py-3 bg-gray-50 ">Action</th>
                  <th scope="col" className="px-4 py-3">Code</th>
                  <th scope='col' className='px-4 py-3'>Username</th>
                  <th scope='col' className='px-4 py-3'>FirstName</th>
                  <th scope='col' className='px-4 py-3'>Last Name</th>
                  <th scope='col' className='px-4 py-3'>Phone Number</th>
                  <th scope='col' className='px-4 py-3'>Email</th>
                  <th scope="col" className="px-4 py-3" style={{ minWidth: '150px' }}>Last By</th>
                  <th scope="col" className="px-4 py-3" style={{ minWidth: '150px' }}>Last Date</th>
                </tr>
              </thead>
              <tbody>
                {currentGenders.map((user, index) => (
                    <tr key={index} className='transition-colors duration-200 border border-b-gray-200 hover:bg-indigo-50'>
                      <td className='sticky left-0 flex px-6 py-4 bg-white'>
                        <input type="checkbox" className="mr-1 action-checkbox" />
                        <FaPen className="text-blue-500 cursor-pointer hover:text-blue-700" onClick={() => openEditModal(user.code, user.username, user.firstname, user.lastname, user.phoneNumber, user.email)} />
                        <FaTrashAlt className="ml-3 text-red-500 cursor-pointer hover:text-red-700" onClick={() => deleteGender(user.code)} />
                    </td>
                    <td className='px-4 py-3'>{user.code}</td>
                    <td className='px-4 py-3' >{user.username}</td>
                    <td className='px-4 py-3' style={{ minWidth: '100px' }}>{user.firstname}</td>
                    <td className='px-4 py-3' style={{ minWidth: '150px' }}>{user.lastname}</td>
                    <td className='px-4 py-3' style={{ minWidth: '150px' }}>{user.phoneNumber}</td>
                    <td className='px-4 py-3' style={{ minWidth: '150px' }}>{user.email}</td>
                    <td className='px-4 py-3' style={{ minWidth: '150px' }}>Last Edited By</td>
                    <td className='px-4 py-3' style={{ minWidth: '160px' }}>Last Edited Date</td>
                    </tr>
                ))}
            </tbody>

            </table>
          </div>

         
          {/* Pagination */}
          <div className="flex flex-col items-center justify-between p-4 md:flex-row">
            <span className="mb-4 text-sm text-gray-600 md:mb-0">
              Page {currentPage} of {totalPages}
            </span>

            <nav className="flex items-center p-4 space-x-2 md:space-x-3">
              <ul className="inline-flex items-center space-x-2 overflow-x-auto">
                {/* Previous Page Button */}
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center py-2 px-3 text-gray-500 bg-white border rounded-lg shadow-sm hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500  ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.293 14.707a1 1 0 01-1.414 0L6.586 10.414a1 1 0 010-1.414l4.293-4.293a1 1 0 011.414 1.414L8.414 10l3.879 3.879a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>

                {/* Page Number Buttons */}
                {getPaginationItems().map((page, index) =>
                  page === "..." ? (
                    <li key={index}>
                      <span className="flex items-center justify-center px-3 py-2 text-gray-500 bg-white border rounded-lg shadow-sm ">...</span>
                    </li>
                  ) : (
                    <li key={index}>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`flex items-center justify-center py-2 px-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500  ${currentPage === page ? 'bg-blue-500 text-white border-blue-600' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'}`}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}

                {/* Next Page Button */}
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center py-2 px-3 text-gray-500 bg-white border rounded-lg shadow-sm hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.707 14.707a1 1 0 010-1.414L11.586 10 7.707 6.121a1 1 0 111.414-1.414l4.293 4.293a1 1 0 010 1.414l-4.293 4.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    
    </section>
  );
};

export default User;
