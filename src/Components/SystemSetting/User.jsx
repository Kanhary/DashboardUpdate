import React, { useState, useEffect } from 'react';
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
// import { AddUser, GetUser } from '../../api/user.js';
import { AddUser, GetUser, GetEmp } from '@/api/user.js';
import { CheckUser, DeleteUser, UpdateUser } from '../../api/user';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import { GiShipBow } from "react-icons/gi";

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
    picture: null,
    path: '' 
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
  const [pictureUrl, setPictureUrl] = useState(null);
  const recordsPerPage = 8;


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
    if (e && e.target) {
      // This is for standard HTML inputs
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value }));
    } else {
      // This is for react-select (or other similar libraries)
      // Assume `e` is the value from react-select
      const selectedValue = e; // e might be an object, use e.value if needed
      setFormData(prev => ({ ...prev, selectedOption: selectedValue }));
    }
  };
  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const pictureUrl = URL.createObjectURL(file);
      setFormData((prevData) => {
        const updatedData = {
          ...prevData,
          picture: file,
          path: pictureUrl, // Store the URL in the path
        };
        console.log("Updated formData:", updatedData); 
        return updatedData;
      });
    }
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
        // Post all the user data
        const response = await CheckUser(updatedFormData);

        console.log('CheckUser response:', response);

        if (response.data.exists) {
            console.log('User already exists');
            setIsLoading(false);
            setErrors({ general: 'User already exists' });

            Swal.fire({
                title: "Exist!",
                text: "User Already Exists",
                icon: "warning"
            });
        } else {
            Swal.fire({
                title: "Successful",
                text: "User created successfully",
                icon: "success"
            });

            // Clear the input fields and reset the form state
            setFormData({
                userCode: '',
                userName: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                cardId: ''
            });
            setSelectedOption(null);
            setErrors({});
        }

    } catch (error) {
        console.error('Error during user check or add:', error);
        setIsLoading(false);
        setErrors({ general: 'Error during user check or add' });

        Swal.fire({
            title: "Error!",
            text: "There was an error creating the user.",
            icon: "error"
        });
    }
};


const handleSave = async () => {
    const validationErrors = {};

    // Validation for required fields
    // if (!formData.userCode) validationErrors.userCode = 'User Code is required';
    if (!formData.userName) validationErrors.userName = 'User Name is required';
    if (!formData.firstName) validationErrors.firstName = 'First Name is required';
    if (!formData.lastName) validationErrors.lastName = 'Last Name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.password) validationErrors.password = 'Password is required';
    if (!formData.cardId) validationErrors.cardId = 'Card ID is required';
    if (!selectedOption) validationErrors.staffCode = 'Staff Code is required';

    // If validation errors exist, stop and display the errors
    if (Object.keys(validationErrors).length > 0) {
        console.log('Validation errors:', validationErrors);
        setErrors(validationErrors);
        return;
    }
    const updatedFormData = { ...formData, staffCode: selectedOption };
    setFormData(updatedFormData);
    // Create a new FormData object to handle file uploads
    
    setIsLoading(true);

    try {
        // Call CheckUser to check for user existence and add the user if they don't exist
        const checkResponse = await CheckUser(updatedFormData);

        console.log('CheckUser response:', checkResponse);

        if (checkResponse.data.exists) {
            console.log('User already exists');
            setErrors({ general: 'User already exists' });

            Swal.fire({
                title: "User Exists!",
                text: "User with this information already exists.",
                icon: "warning"
            });

            setIsLoading(false);
            return;
        }

        // If the user was added successfully
        console.log('User created successfully:', checkResponse);

        Swal.fire({
            title: "Success!",
            text: "User created successfully.",
            icon: "success"
        });

        closeAddModal(); // Close the modal on success

    } catch (error) {
        console.error('Error during user creation:', error);
        setErrors({ general: 'Error during user creation' });

        Swal.fire({
            title: "Error!",
            text: "There was an error creating the user. Please try again.",
            icon: "error"
        });

    } finally {
        setIsLoading(false);  // Set loading to false after the process
    }
  };

  // const handleClick = () => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#22c55e",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!"
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire({
  //         title: "Deleted!",
  //         text: "Your file has been deleted.",
  //         icon: "success"
  //       });
  //     }
  //   });
  // };
  

  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  useEffect(() => {
    if (formData.picture && (formData.picture instanceof File || formData.picture instanceof Blob)) {
      const url = URL.createObjectURL(formData.picture);
      setPictureUrl(url);
  
      // Cleanup URL object
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPictureUrl(null); // Reset the picture URL if no valid picture is present
    }
  }, [formData.picture]);
  
  
  
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


  useEffect(() => {
    setCurrentPage(0); // Reset to first page when users data changes
  }, [users]);

  const filteredUser = users.filter(user =>
    (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.userName && user.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.userCode && user.userCode.includes(searchTerm))
  );
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const totalPages = Math.ceil(filteredUser.length / recordsPerPage);
  const indexOfLastRecord = (currentPage + 1) * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentPageUsers = filteredUser.slice(indexOfFirstRecord, indexOfLastRecord);
  
  const getPaginationItems = () => {
    let pages = [];
    if (totalPages <= 7) {
      pages = [...Array(totalPages)].map((_, index) => index + 1);
    } else {
      if (currentPage < 4) {
        pages = [1, 2, 3, '...', totalPages];
      } else if (currentPage > totalPages - 3) {
        pages = [1, '...', totalPages - 3, totalPages - 2, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }
    return pages;
  };

  const handlePageClick = (event) => {
    console.log("Page clicked:", event.selected); 
    setCurrentPage(event.selected);
  };
  // const handleChangeSelection = (e) => {
  //   setSelectedOption(e.target.value);
  // };
  const handleDelete = async (ID) => {
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
            const response = await DeleteUser(ID);
            console.log('Response:', response);  // Log the response to debug

            if (response.status === 200) {  // Check HTTP status code directly
              Swal.fire({
                  title: "Deleted!",
                  text: "User has been deleted.",
                  icon: "success",
                  confirmButtonText: "Okay",
              });
          
              const deleteUSer = users.filter(user => user.id !== ID);
              setUsers(deleteUSer);
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
        
        if (error.response) {
            console.log('Error response:', error.response);  // Full error response
        } else {
            console.log('Error message:', error.message);  // Error message if no response
        }

        Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to connect to the server.',
            icon: 'error',
            confirmButtonText: 'Okay',
        });
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedFormData = { ...formData, staffCode: selectedOption };
  
      setIsLoading(true); // Show a loading state (optional)
  
      // Ensure you're editing a valid user
      if (!editingUser) {
        console.error("No user selected for editing");
        return;
      }
  
      // Log formData before making the API call to verify the correct data is sent
      console.log("Updated Form Data:", updatedFormData);
  
      // Make the API call to update the user
      const response = await UpdateUser(editingUser.id, updatedFormData);
  
      console.log('Update response:', response);
  
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "User updated successfully.",
          icon: "success",
        });
        // Optionally, close the modal after success
        closeEditModal();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to update user.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || 'An error occurred.',
        icon: "error",
      });
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };
  
  const handleChangeSelection = (selectedOption) => {
    // Ensure selectedOption is the correct value
    const selectedValue = selectedOption ? selectedOption.value : null;
    setSelectedOption(selectedValue);
    console.log('Selected staff code:', selectedValue); // Should log the staff code
};

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    background: '#fff',
    borderColor: '#9e9e9e',
    minHeight: '30px',
    height: '37px',
    boxShadow: state.isFocused ? null : null,
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: '30px',
    padding: '0 6px'
  }),

  input: (provided, state) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorSeparator: state => ({
    display: 'none',
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '30px',
  }),
};
// Format options for react-select
const optionsStaffCode = employees.map(employee => ({
  value: employee.staffCode,
  label: `${employee.staffCode} - ${employee.laTanName}`
}));

const optionsRole = [
  {value: 'Admin', label: 'Admin'},
  {value: 'Editor', label: 'Editor'},
  {value: 'User', label: 'User'},
  {value: 'Guest', label: 'Guest'}
]
  
  return (
    <section className='mt-16 font-khmer'>
      <h1 className='text-xl font-medium text-blue-800'>អ្នកប្រើប្រាស់</h1>
      <div className='mt-3 border'></div>
      <div className='w-full mt-4' data-aos='fade-up'>
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
          
          <div className='w-full overflow-x-auto' data-aos='fade-right'>
            <table className='w-full text-sm text-left text-gray-500'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                <tr>
                  <th scope="col" className="sticky left-0 px-4 py-3 bg-gray-50">Action</th>
                  {/* <th scope="col" className="px-4 py-3" style={{ minWidth: '150px' }}>User Code</th> */}
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Username</th>
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>First Name</th>
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Last Name</th>
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Phone Number</th>
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Email</th>
                  {/* <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Password</th> */}
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Card ID</th>
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px' }}>Staff Code</th>
                  <th scope='col' className='px-4 py-3' style={{ minWidth: '150px '}}>Picture</th>
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
                        key={user.id}
                        className='text-red-600 hover:text-red-800'
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrashAlt />
                      </button>

                    </td>
                    {/* <td className='px-4 py-3'>{user.userCode}</td> */}
                    <td className='px-4 py-3'>{user.userName}</td>
                    <td className='px-4 py-3'>{user.firstName}</td>
                    <td className='px-4 py-3'>{user.lastName}</td>
                    <td className='px-4 py-3'>{user.phone}</td>
                    <td className='px-4 py-3'>{user.email}</td>
                    {/* <td className='px-4 py-3'>{user.password}</td> */}
                    <td className='px-4 py-3'>{user.cardId}</td>
                    <td className='px-4 py-3'>{user.staffCode}</td>
                    <td className='px-4 py-3'>{user.picture}</td>
                    <td className='px-4 py-3'>{user.lastBy}</td>
                    <td className='px-4 py-3'>{user.lastDate}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          <div className="flex flex-col items-center justify-between p-4 md:flex-row">
            <span className="mb-4 text-sm text-gray-600 md:mb-0">
              Page {currentPage} of {totalPages}
            </span>

            <nav className="flex items-center p-4 space-x-2 md:space-x-3">
              <ul className="inline-flex items-center p-2 space-x-2 overflow-x-auto">
                {/* Previous Page Button */}
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center py-2 px-3 text-gray-500 bg-gradient-to-r from-gray-200 to-gray-300 border rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      <span className="flex items-center justify-center px-3 py-2 text-gray-500 border rounded-lg shadow-md bg-gradient-to-r from-gray-200 to-gray-300">
                        ...
                      </span>
                    </li>
                  ) : (
                    <li key={index}>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`flex items-center justify-center py-2 px-3 border rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${currentPage === page ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg' : 'text-gray-500 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400'}`}
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
                    className={`flex items-center justify-center py-2 px-3 text-gray-500 bg-gradient-to-r from-gray-200 to-gray-300 border rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.707 14.707a1 1 0 010-1.414L11.586 10 7.707 6.121a1 1 0 111.414-1.414l4.293 4.293a1 1 010 1.414l-4.293 4.293a1 1 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

        </div>
      </div>
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm ">
          <div className="relative flex flex-col w-full mx-auto overflow-auto transition-all transform bg-white shadow-2xl lg:w-2/3 rounded-xl h-5/6" data-aos='zoom-in'>
            <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
          
            <h2 className="flex items-center space-x-2 text-xl font-bold text-white md:text-2xl">
              {/* <GiShipBow className="text-3xl animate-ship" /> */}
              <span>បន្ថែមអ្នកប្រើប្រាស់ថ្មី</span>
            </h2>
              <button onClick={closeAddModal} className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl">
                &times;
              </button>
            </header>
            <form className="z-10 flex flex-col flex-grow px-6 py-6 space-y-6 md:flex-row md:space-x-6" data-aos='zoom-in'>
              {/* Left Side: Form Inputs */}
              <div className="w-full space-y-6 md:w-3/4">
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
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
                  <div className="w-full md:w-1/2">
                    <label htmlFor="role" className="block mb-2 text-sm font-semibold text-gray-700">Role</label>
                    <Select
                      value={optionsRole.find(option => option.value === selectedOption)}
                      onChange={handleChangeSelection}
                      options={optionsRole}
                      placeholder="Select or type to search"
                      className="basic-single"
                      classNamePrefix="select"
                      styles={customStyles}
                    />
                    {errors.staffCode && <p className="mt-1 text-xs text-red-500">{errors.staffCode}</p>}
                  </div>
                  {/* Select for Staff Code */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="staffCode" className="block mb-2 text-sm font-semibold text-gray-700">Staff Code</label>
                    <Select
                      value={optionsStaffCode.find(option => option.value === selectedOption)}
                      onChange={handleChangeSelection}
                      options={optionsStaffCode}
                      placeholder="Select or type to search"
                      className="basic-single"
                      classNamePrefix="select"
                      styles={customStyles}
                    />
                    {errors.staffCode && <p className="mt-1 text-xs text-red-500">{errors.staffCode}</p>}
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
                  {/* Input for Email */}
                  <div className="w-full md:w-1/2">
                    <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                    <input
                      type="text"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full px-4 py-2 text-sm text-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>
                <div className="w-full">
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
              </div>

              {/* Right Side: Picture Upload */}
              <div className="flex items-center w-full space-y-4 justify-evenly lg:justify-center lg:flex-col md:w-1/4">
      <div className="relative flex items-center justify-center w-40 h-40 overflow-hidden bg-gray-100 rounded-lg shadow-lg">
        {formData.picture ? (
          <img
            src={formData.path} // Use the stored path
            alt="Profile"
            className="object-cover w-full h-full"
          />
        ) : (
          <svg
            className="w-12 h-12 text-gray-400"
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
        className="flex items-center px-4 py-2 text-sm font-semibold text-center text-white transition-colors duration-200 bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600"
      >
        {formData.picture ? "Change Picture" : "Upload Picture"}
      </label>
    </div>
            </form>

            {/* Footer */}
            <footer className="flex justify-end flex-shrink-0 p-4 space-x-4 bg-gray-100 rounded-b-xl">
            <button onClick={handleSave} className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto">
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
        <div className="relative flex flex-col w-full mx-auto overflow-auto transition-all transform bg-white shadow-2xl lg:w-2/3 rounded-xl h-5/6">
          <header className="sticky top-0 flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
          <h2 className="flex items-center space-x-2 text-xl font-bold text-white md:text-2xl">
            <GiShipBow className="text-3xl animate-ship" />
            <span>កែរប្រែព័ត៌មានអ្នកប្រើប្រាស់</span>
          </h2>
            <button onClick={closeEditModal} className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl">
              &times;
            </button>
          </header>
          <form className="flex flex-col flex-grow px-6 py-6 space-y-6 md:flex-row md:space-x-6">
            {/* Left Side: Form Inputs */}
            <div className="w-full space-y-6 md:w-3/4">
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
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
                <div className="w-full md:w-1/2">
                    <label htmlFor="role" className="block mb-2 text-sm font-semibold text-gray-700">Role</label>
                    <Select
                      value={optionsRole.find(option => option.value === selectedOption)}
                      onChange={handleChangeSelection}
                      options={optionsRole}
                      placeholder="Select or type to search"
                      className="basic-single"
                      classNamePrefix="select"
                      styles={customStyles}
                    />
                    {errors.staffCode && <p className="mt-1 text-xs text-red-500">{errors.staffCode}</p>}
                </div>
                
                {/* Select for Staff Code */}
                <div className="w-full md:w-1/2">
                  <label htmlFor="staffCode" className="block mb-2 text-sm font-semibold text-gray-700">Staff Code</label>
                  <Select
                    value={options.find(option => option.value === selectedOption)}
                    onChange={handleChangeSelection}
                    options={options}
                    placeholder="Select or type to search"
                    className="basic-single"
                    classNamePrefix="select"
                  />
                  {errors.staffCode && <p className="mt-1 text-xs text-red-500">{errors.staffCode}</p>}
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
                {/* Input for Email */}
                <div className="w-full md:w-1/2">
                  <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full px-4 py-2 text-sm text-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>
              <div className="w-full">
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

          {/* Footer */}
          <footer className="flex justify-end flex-shrink-0 p-4 space-x-4 bg-gray-100 rounded-b-xl">
          <button onClick={handleSaveEdit} className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto">
              Save
            </button>
            
            <button onClick={closeEditModal} className="w-full px-5 py-2 text-sm font-medium text-gray-700 transition duration-200 transform bg-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 md:w-auto">
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
