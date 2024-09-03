import React, { useState, useEffect } from 'react';
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
// import { AddUser, GetUser } from '../../api/user.js';
import { AddUser, GetUser, GetEmp } from '@/api/user.js';
import { CheckUser, DeleteUser } from '../../api/user';
import ReactPaginate from 'react-paginate';

const User = () => {
  const INITIAL_FORM_DATA = { 
    userCode: '', 
    userName: '', 
    firstName: '', 
    lastName: '', 
    phone: '', 
    email: '', 
    password: '', 
    cardId: '', 
    staffCode: '', 
    picture: null 
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]); // State to store employee data
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');
  const recordsPerPage = 8;
  const [itemsPerPage] = useState(8)

  useEffect(() => {
    setCurrentPage(0); // Reset to first page when users data changes
  }, [users]);

  const filteredUser = users.filter(user =>
    (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.userCode && user.userCode.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredUser.length / recordsPerPage);
  const indexOfLastRecord = (currentPage + 1) * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentPageUsers = filteredUser.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePageClick = (event) => {
    console.log("Page clicked:", event.selected); // Debug
    setCurrentPage(event.selected);
  };

  // const getPaginationItems = () => {
  //   let pages = [];
  //   if (totalPages <= 7) {
  //     pages = [...Array(totalPages)].map((_, index) => index + 1);
  //   } else {
  //     if (currentPage < 4) {
  //       pages = [1, 2, 3, '...', totalPages];
  //     } else if (currentPage > totalPages - 3) {
  //       pages = [1, '...', totalPages - 3, totalPages - 2, totalPages];
  //     } else {
  //       pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  //     }
  //   }
  //   console.log('Pagination items:', pages); // Debugging line
  //   return pages;
  // };
  
  // const handlePageClick = (e) =>{
  //   console.log(e);
  // }

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setFormData(INITIAL_FORM_DATA);
    setIsAddModalOpen(false);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData(user);
    setIsEditModalOpen(true);
  };
  

  const closeEditModal = () => {
    setEditingUser(null);
    setFormData(INITIAL_FORM_DATA);
    setIsEditModalOpen(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveNew = async () => {
    const validationErrors = {};

    // Check required fields
    if (!formData.userCode) validationErrors.userCode = 'User Code is required';
    if (!formData.userName) validationErrors.userName = 'User Name is required';
    if (!formData.firstName) validationErrors.firstName = 'First Name is required';
    if (!formData.lastName) validationErrors.lastName = 'Last Name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.password) validationErrors.password = 'Password is required';
    if (!formData.cardId) validationErrors.cardId = 'Card ID is required';
    if (!formData.staffCode) validationErrors.staffCode = 'Staff Code is required';

    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    setIsLoading(true);
    try {
      const checkData = await CheckUser({
          userName: formData.userName,
          userCode: formData.userCode,
      });
  
      if (checkData.data.exists) {
          Swal.fire({
              text: 'User already exists',
              icon: 'warning',
              confirmButtonText: 'Okay'
          });
          setIsLoading(false);
          return;
      }
      
      // Proceed with adding the user
      const res = await AddUser(updatedFormData);
      // Handle the response as you are currently doing
  
  } catch (error) {
      // Error handling
      console.error('Error:', error);
      Swal.fire({
          title: 'Error!',
          text: error.message || 'Failed to connect to the server.',
          icon: 'error',
          confirmButtonText: 'Okay'
      });
  } finally {
      setIsLoading(false);
  }
  
  };

  
  const handleSave = async () => {
    // Reset previous errors
    const validationErrors = {};

    // Check required fields
    if (!formData.userCode) validationErrors.userCode = 'User Code is required';
    if (!formData.userName) validationErrors.userName = 'User Name is required';
    if (!formData.firstName) validationErrors.firstName = 'First Name is required';
    if (!formData.lastName) validationErrors.lastName = 'Last Name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.password) validationErrors.password = 'Password is required';
    if (!formData.cardId) validationErrors.cardId = 'Card ID is required';
    if (!selectedOption) validationErrors.staffCode = 'Staff Code is required';

    if (Object.keys(validationErrors).length > 0) {
        console.log('Validation errors:', validationErrors);
        setErrors(validationErrors);
        return;
    }

    // Update formData with selectedOption
    const updatedFormData = { ...formData, staffCode: selectedOption };
    setFormData(updatedFormData);

    setIsLoading(true);

    try {
      const checkResponse = await CheckUser({
        userName: formData.userName,
        userCode: formData.userCode,
    });
    
    console.log('CheckUser response:', checkResponse);
    
    // Ensure `checkResponse.data.exists` correctly reflects whether the user exists
    if (checkResponse.data.exists) {
        Swal.fire({
            text: 'User already exists',
            icon: 'warning',
            confirmButtonText: 'Okay'
        }).then(() => {
            setIsLoading(false);
            return;
        });
    }
     else {
            // Adding new user
            const addUserResponse = await AddUser(updatedFormData);

            // Log the response to debug
            console.log('AddUser response:', addUserResponse);

            if (addUserResponse.data.code === '200') {
                Swal.fire({
                    text: 'User created successfully',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                }).then(() => {
                    closeAddModal();
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to create user.',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                });
            }
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Failed to connect to the server.',
            icon: 'error',
            confirmButtonText: 'Okay'
        });
    } finally {
        setIsLoading(false);
    }
};

  
  const handleClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  };
  

  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, picture: file });
      setUploadSuccess(true);  // Show success message
    }
  };

  // Fetch users and employees
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await GetUser();  
        setUsers(response.data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } 
    };

    const fetchEmployees = async () => {
      try {
        const response = await GetEmp();
        setEmployees(response.data.data)
      } catch (err) {
        setError(err.message || 'An error occurred');
      }
    };
    
    fetchUsers();
    fetchEmployees();
    // setCurrentPage(0);
  }, []);

  const handleChangeSelection = (e) => {
    setSelectedOption(e.target.value);
  };
  const handleDelete = async (userCode) => {
    try {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            const response = await DeleteUser(userCode);

            if (response.data.code === '200') {
                Swal.fire({
                    title: "Deleted!",
                    text: "User has been deleted.",
                    icon: "success",
                    confirmButtonText: "Okay",
                });

                const updatedUsers = users.filter(user => user.userCode !== userCode);
                setUsers(updatedUsers);
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete user.",
                    icon: "error",
                    confirmButtonText: "Okay",
                });
            }
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        Swal.fire({
            title: 'Error!',
            text: 'Failed to connect to the server.',
            icon: 'error',
            confirmButtonText: 'Okay',
        });
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
            <table className='w-full text-sm text-left text-gray-500'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                <tr>
                  <th scope="col" className="sticky left-0 px-4 py-3 bg-gray-50">Action</th>
                  <th scope="col" className="px-4 py-3" style={{ minWidth: '150px' }}>User Code</th>
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Username</th>
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>First Name</th>
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Last Name</th>
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Phone Number</th>
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Email</th>
                  {/* <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Password</th> */}
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Card ID</th>
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Employee ID</th>
                  <th scope="col" className="px-4 py-3" style={{ minWidth: '150px' }}>Last By</th>
                  <th scope="col" className="px-4 py-3" style={{ minWidth: '150px' }}>Last Date</th>
                </tr>
              </thead>
              <tbody>
                {currentPageUsers.map(user => (
                  <tr key={`${user.userCode}-${user.userName}`} className='border-b'>
                    <td className='sticky left-0 flex items-center px-4 py-3 space-x-3 bg-white'>
                      <button
                        className='text-blue-600 hover:text-blue-800'
                        onClick={() => openEditModal(user)}
                      >
                        <FaPen />
                      </button>
                      <button
                        key={user.userCode}
                        className='text-red-600 hover:text-red-800'
                        onClick={() => handleDelete(user.userCode)}
                      >
                        <FaTrashAlt />
                      </button>

                    </td>
                    <td className='px-4 py-3'>{user.userCode}</td>
                    <td className='px-4 py-3'>{user.userName}</td>
                    <td className='px-4 py-3'>{user.firstName}</td>
                    <td className='px-4 py-3'>{user.lastName}</td>
                    <td className='px-4 py-3'>{user.phone}</td>
                    <td className='px-4 py-3'>{user.email}</td>
                    {/* <td className='px-4 py-3'>{user.password}</td> */}
                    <td className='px-4 py-3'>{user.cardId}</td>
                    <td className='px-4 py-3'>{user.staffCode}</td>
                    <td className='px-4 py-3'>{user.lastBy}</td>
                    <td className='px-4 py-3'>{user.lastDate}</td>
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

            <ReactPaginate
              previousLabel={<span className="pagination-arrow">{"<<"}</span>}
              nextLabel={<span className="pagination-arrow">{">>"}</span>}
              breakLabel={<span className="pagination-dots">...</span>}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName="pagination-container"
              activeClassName="pagination-active"
              pageClassName="pagination-page"
              previousClassName="pagination-previous"
              nextClassName="pagination-next"
              breakClassName="pagination-break"
            />
          </div>
        </div>
      </div>
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full mx-auto overflow-auto transition-all transform bg-white shadow-2xl lg:w-2/3 rounded-xl h-2/3 lg:h-5/6">
            <header className="sticky top-0 flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
              <h2 className="text-xl font-bold text-white md:text-2xl">បន្ថែមអ្នកប្រើប្រាស់</h2>
              <button onClick={closeAddModal} className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl">
                &times;
              </button>
            </header>
            <form className="flex flex-col px-6 py-6 space-y-6 md:flex-row md:space-x-6">
              {/* Left Side: Form Inputs */}
              <div className="w-full space-y-6 md:w-3/4">
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  {/* Input for Code */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="userCode" className="block mb-2 text-sm font-semibold text-gray-700">User Code</label>
                    <input
                      type="text"
                      id="userCode"
                      value={formData.userCode}
                      onChange={handleChange}
                      className={`block w-full px-4 py-2 text-sm text-gray-800 border ${errors.userCode ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200`}
                    />
                    {errors.userCode && <p className="mt-1 text-xs text-red-500">{errors.userCode}</p>}
                  </div>
                  {/* Input for Username */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="userName" className="block mb-2 text-sm font-semibold text-gray-700">Username</label>
                    <input
                      type="text"
                      id="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                      autoComplete="username"
                    />
                    {errors.userName && <p className="mt-1 text-xs text-red-500">{errors.userName}</p>}
                  </div>

                </div>
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  {/* Input for First Name */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="firstName" className="block mb-2 text-sm font-semibold text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`block w-full px-4 py-2 text-sm text-gray-800 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200`}
                    />
                    {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                  </div>
                  {/* Input for Last Name */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="lastName" className="block mb-2 text-sm font-semibold text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`block w-full px-4 py-2 text-sm text-gray-800 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200`}
                    />
                    {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  {/* Input for Phone Number */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="phone" className="block mb-2 text-sm font-semibold text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label htmlFor="staffCode" className="block mb-2 text-sm font-semibold text-gray-700">Staff Code</label>
                    <select
                      value={selectedOption}
                      onChange={handleChangeSelection}
                      className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    >
                      <option value="">Select Employee ID</option>
                      {
                        employees.map((employee, index) => (
                          <option key={`${employee.staffCode}-${index}`} value={employee.staffCode}>
                            {employee.staffCode} - {employee.laTanName}
                          </option>
                        ))
                      }
                    </select>
                    {error && <div className="text-red-600">{error}</div>}
                  </div>
                </div>
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  {/* Input for Card ID */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="cardId" className="block mb-2 text-sm font-semibold text-gray-700">Card ID</label>
                    <input
                      type="text"
                      id="cardId"
                      value={formData.cardId}
                      onChange={handleChange}
                      className={`block w-full px-4 py-2 text-sm text-gray-800 border ${errors.cardId ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200`}
                    />
                    {errors.cardId && <p className="mt-1 text-xs text-red-500">{errors.cardId}</p>}
                  </div>
                  {/* Input for Password */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full px-4 py-2 text-sm text-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200`}
                      autoComplete="current-password"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                  </div>

                </div>
                <div className="w-full">
                  <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Right Side: Picture Upload */}
              <div className="flex items-center w-full space-y-4 justify-evenly lg:justify-center lg:flex-col md:w-1/4">
                <div className="relative flex items-center justify-center w-32 h-32 overflow-hidden bg-gray-100 rounded-lg shadow-md">
                  {formData.picture ? (
                    <img
                      src={URL.createObjectURL(formData.picture)}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  )}
                </div>
                <input
                  type="file"
                  id="picture"
                  accept="image/*"
                  onChange={handlePictureChange}
                  className="hidden"
                />
                <label
                  htmlFor="picture"
                  className="px-4 py-2 text-sm font-semibold text-center text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 focus:outline-none"
                >
                {formData.picture ? "Change Picture" : "Upload Picture"}
                </label>
              </div>
            </form>

            <footer className="flex flex-col items-center justify-end px-6 py-4 space-y-3 space-y-reverse bg-gray-100 rounded-b-xl md:flex-row md:space-x-3 md:space-y-0">
                    
              <button onClick={handleSave} className="w-full px-5 py-2 mb-3 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto lg:mb-0">
                Save
              </button>
              <button onClick={handleSaveNew} className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-green-500 to-green-700 hover:shadow-lg hover:scale-105 md:w-auto">
                Save & New
              </button>
              <button onClick={closeAddModal} className="w-full px-5 py-2 text-sm font-medium text-gray-700 transition duration-200 transform bg-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 md:w-auto">
                Cancel
              </button>
            </footer>
          </div>
        </div>
      )}



      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full mx-auto overflow-auto transition-all transform bg-white shadow-2xl lg:w-2/3 rounded-xl h-2/3 lg:h-5/6">
            <header className="sticky top-0 flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
              <h2 className="text-xl font-bold text-white md:text-2xl">បន្ថែមអ្នកប្រើប្រាស់</h2>
              <button onClick={closeEditModal} className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl">
                &times;
              </button>
            </header>
            <form className="flex flex-col px-6 py-6 space-y-6 md:flex-row md:space-x-6">
              {/* Left Side: Form Inputs */}
              <div className="w-full space-y-6 md:w-3/4">
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  {/* Input for Code */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="userCode" className="block mb-2 text-sm font-semibold text-gray-700">User Code</label>
                    <input
                      type="text"
                      id="userCode"
                      value={formData.userCode}
                      onChange={handleChange}
                      disabled
                      className={`block w-full px-4 py-2 text-sm text-gray-800 border ${errors.userCode ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200`}
                    />
                    {errors.userCode && <p className="mt-1 text-xs text-red-500">{errors.userCode}</p>}
                  </div>
                  {/* Input for Username */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="userName" className="block mb-2 text-sm font-semibold text-gray-700">Username</label>
                    <input
                      type="text"
                      id="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                      autoComplete="username"
                    />
                    {errors.userName && <p className="mt-1 text-xs text-red-500">{errors.userName}</p>}
                  </div>

                </div>
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  {/* Input for First Name */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="firstName" className="block mb-2 text-sm font-semibold text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`block w-full px-4 py-2 text-sm text-gray-800 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200`}
                    />
                    {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                  </div>
                  {/* Input for Last Name */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="lastName" className="block mb-2 text-sm font-semibold text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`block w-full px-4 py-2 text-sm text-gray-800 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200`}
                    />
                    {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  {/* Input for Phone Number */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="phone" className="block mb-2 text-sm font-semibold text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label htmlFor="staffCode" className="block mb-2 text-sm font-semibold text-gray-700">Employee ID</label>
                    <select
                      value={selectedOption}
                      onChange={handleChangeSelection}
                      className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    >
                      <option value="">Select Employee ID</option>
                      {
                        employees.map((employee, index) => (
                          <option key={`${employee.staffCode}-${index}`} value={employee.staffCode}>
                            {employee.staffCode} - {employee.laTanName}
                          </option>
                        ))
                      }
                    </select>
                    {error && <div className="text-red-600">{error}</div>}
                  </div>
                </div>
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  {/* Input for Card ID */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="cardId" className="block mb-2 text-sm font-semibold text-gray-700">Card ID</label>
                    <input
                      type="text"
                      id="cardId"
                      value={formData.cardId}
                      onChange={handleChange}
                      className={`block w-full px-4 py-2 text-sm text-gray-800 border ${errors.cardId ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200`}
                    />
                    {errors.cardId && <p className="mt-1 text-xs text-red-500">{errors.cardId}</p>}
                  </div>
                  {/* Input for Password */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full px-4 py-2 text-sm text-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200`}
                      autoComplete="current-password"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                  </div>

                </div>
                <div className="w-full">
                  <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Right Side: Picture Upload */}
              <div className="flex items-center w-full space-y-4 justify-evenly lg:justify-center lg:flex-col md:w-1/4">
                <div className="relative flex items-center justify-center w-32 h-32 overflow-hidden bg-gray-100 rounded-lg shadow-md">
                  {formData.picture ? (
                    <img
                      src={URL.createObjectURL(formData.picture)}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  )}
                </div>
                <input
                  type="file"
                  id="picture"
                  accept="image/*"
                  onChange={handlePictureChange}
                  className="hidden"
                />
                <label
                  htmlFor="picture"
                  className="px-4 py-2 text-sm font-semibold text-center text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 focus:outline-none"
                >
                {formData.picture ? "Change Picture" : "Upload Picture"}
                </label>
              </div>
            </form>

            <footer className="flex flex-col items-center justify-end px-6 py-4 space-y-3 space-y-reverse bg-gray-100 rounded-b-xl md:flex-row md:space-x-3 md:space-y-0">
                    
              <button onClick={handleSave} className="w-full px-5 py-2 mb-3 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto lg:mb-0">
                Save
              </button>
              <button onClick={handleSaveNew} className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-green-500 to-green-700 hover:shadow-lg hover:scale-105 md:w-auto">
                Save & New
              </button>
              <button onClick={closeAddModal} className="w-full px-5 py-2 text-sm font-medium text-gray-700 transition duration-200 transform bg-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 md:w-auto">
                Cancel
              </button>
            </footer>
          </div>
        </div>
      )}

      
    </section>
  );
};

export default User;
