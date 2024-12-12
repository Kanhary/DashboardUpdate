import React, { useState ,useEffect} from 'react';
import { FaPen, FaTrashAlt, FaEye } from 'react-icons/fa';
import { IoMdRefresh } from "react-icons/io";
import Swal from 'sweetalert2';
import Select from 'react-select';
import { GetAllBranch , GetCompany, AddNewBranch, UpdateBranch, DeleteBranch} from '../../../api/user';

const Branch = () => {
  const INITIAL_FORM_DATA = {
    companyCode: '',
    branchCode: '',
    engName: '',
    khName: '',
    phone: '',
    address: '',
    email: '',
    vatNo: '',
    isUse: '',
    bankName: '',
    bankAccName: '',
    bankAccNo: '',
    bankBranch: '',
    companyLogo: ''
  };

  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [companies, setCompany] = useState([]);
  

  // const branchList = [
  //   {
  //     CompanyCode: 'PPAP',
  //     BranchCode: 'branch-1',
  //     Branch: 'នាយកដ្ឋានសាខា',
  //     LastBy: 'John Doe',
  //     LastDate: '2024-10-10',
  //   },
  // ];

  useEffect(() => {
    const fetchAllbranch = async () => {
      try {
        const response = await GetAllBranch();
        console.log(response.data.data); 
        setBranchList(response.data.data);
        
      } catch (err) {
        setError({ message: err.message || 'An error occurred' });
      }
    };

    const fetchCompany = async () => {
      try {
        const response = await GetCompany();
        console.log(response.data.data); 
        setCompany(response.data.data);
        
      } catch (err) {
        setError({ message: err.message || 'An error occurred' });
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await GetUserLogin(); // Call the API to get the current user
        setCurrentUser(response.data.data.username); // Assuming the response contains a username field
        console.log('Fetched user:', response.data.data.username);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    
    fetchCurrentUser();
    fetchAllbranch();
    fetchCompany();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const filteredBranches = branchList.filter(branch =>
    branch.engName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.khName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.branchCode.includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredBranches.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentBranches = filteredBranches.slice(indexOfFirstRecord, indexOfLastRecord);
  
  

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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    console.log('Submitting form data:', formData); 
  
    try {
      
      const response = await AddNewBranch(formData); 
  
      console.log(response); 
  
      if (response.status === 200) {
        // Show success alert
        Swal.fire({
          title: "Successful",
          text: "Branch created successfully",
          icon: "success",
          confirmButtonText: 'OK',
          customClass: {
            title: 'text-lg font-semibold text-blue-800',
            content: 'text-sm text-gray-700',
            confirmButton: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          }
        });
  
        // Close the modal after successful save
        setIsAddModalOpen(false);
      } else {
        // Handle error responses
        const errorMessage = response.data.message || 'An unexpected error occurred.';
        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: 'OK',
          customClass: {
            title: 'text-lg font-semibold text-red-800',
            content: 'text-sm text-gray-700',
            confirmButton: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
          }
        });
      }
    } catch (error) {
      // Catch any other errors that occur during the save process
      console.error('Error during save operation:', error);
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: 'OK',
        customClass: {
          title: 'text-lg font-semibold text-red-800',
          content: 'text-sm text-gray-700',
          confirmButton: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
        }
      });
    }
  };
  

  const handleUpdate = async () => {
    try {
      console.log('Saving office data:', formData);
      const id = formData.id;  // Ensure this is valid
      if (!id) {
        Swal.fire({
          title: "Error",
          text: "Office ID is missing",
          icon: "warning"
        });
        return;
      }
  
      const response = await UpdateBranch(id, formData);
  
      if (response.status === 200) {
        console.log('Office updated successfully:', response.data);
        Swal.fire({
          title: "Successful",
          text: "Office updated successfully",
          icon: "success"
        });
        setIsEditModalOpen(false);  // Close the edit modal
      } else {
        const errorMessage = response.data.message || 'An unexpected error occurred.';
        Swal.fire({
          title: "Error",
          text: "Error: " + errorMessage,
          icon: "warning"
        });
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        Swal.fire({
          title: "Error",
          text: error.response.data.message || 'An unexpected error occurred.',
          icon: "error"
        });
      } else if (error.request) {
        console.error('Error request:', error.request);
        Swal.fire({
          title: "Error",
          text: "No response received from the server.",
          icon: "error"
        });
      } else {
        console.error('Error message:', error.message);
        Swal.fire({
          title: "Error",
          text: "An error occurred while setting up the request.",
          icon: "error"
        });
      }
    }
  };
  
  const deleteBranch = async (id) => {
    try {
        // Show a confirmation prompt before deleting
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
            
            const response = await DeleteBranch(id); 
            console.log('Response:', response); 
  
            if (response.status === 200) {  
                Swal.fire({
                    title: "Deleted!",
                    text: "Office has been deleted.",
                    icon: "success",
                    confirmButtonText: "Okay",
                });
  
                
                const updatedOffices = branchList.filter(branch => branch.id !== id);
                setBranchList(updatedOffices);  
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete office.",
                    icon: "error",
                    confirmButtonText: "Okay",
                });
            }
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to connect to the server.',
            icon: 'error',
            confirmButtonText: 'Okay',
        });
    }
  };

  const openAddModal = () => {
    setFormData(INITIAL_FORM_DATA);  // Reset the form data before opening the Add Modal
    setIsAddModalOpen(true);
  };
  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setFormData(branch);
    setIsEditModalOpen(true);
  };

  const openViewModal = (branchCode) => {
    const branchToView = branchList.find(branch => branch.BranchCode === branchCode);
    if (branchToView) {
      setFormData(branchToView);
      setIsViewModalOpen(true);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingBranch(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleRefresh = () => {
    window.location.reload();
  };


  const optionsCompany = companies.map(company => ({
    value: company.companyCode,
    label: `${company.companyCode} - ${company.engName}`
  }));

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

  const handleCompanyChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      companyCode: selectedOption ? selectedOption.value : '',
    }));
  };

  return (
    <section className='mt-16'>
      <h1 className='text-xl font-medium text-blue-800'>បញ្ចូលព័ត៌មានសាខា</h1>
      <div className='mt-3 border'></div>
      <div className='w-full mt-4'data-aos='fade-up'>
        
        <div className='relative w-full overflow-hidden bg-white shadow-md sm:rounded-lg'>
          <div className='flex flex-col items-center justify-between p-4 space-x-4 space-y-3 md:flex-row md:space-y-0'>
            <div className='w-full md:w-1/2'>
              <form className='flex items-center '>
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
                    placeholder='Search Company Code'
                    className='block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className='flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3'>
            <button
                onClick={handleRefresh}
                className="flex items-center justify-center px-5 py-2 text-lg font-medium text-white transition-transform transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 hover:scale-105 active:scale-95"
              >
                <IoMdRefresh />
                Refresh
              </button>
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
          <div className='w-full overflow-x-auto'  data-aos='fade-right'>
            <table className='w-full text-sm text-left text-gray-500 '>
              <thead className='text-xs text-gray-700 uppercase bg-gray-100'>
                <tr>
                  <th scope="col" className="sticky left-0 px-4 py-3 mr-3 bg-gray-100 border-t border-r" >Action</th>
                  <th scope="col" className="px-4 py-3 border-t border-r-2" style={{minWidth: '150px'}}>Company Code</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>Branch Code</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>Khmer Name</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>English Name</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>Phone</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>Address</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>Email</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>VAT Number</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>Bank Name</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>Bank Acoount Name</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>Bank Account Number</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>Back branch</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>Company Logo</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>Last By</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{minWidth: '200px'}}>Last Date</th>
            </tr>
              </thead>
              <tbody>
  {currentBranches.map((branch, index) => (
    <tr
      key={branch.id}
      className='transition-colors duration-200 border border-b-gray-200 hover:bg-indigo-50'
    >
      <td className="sticky left-0 z-10 flex items-center px-4 py-6 bg-white border-r" >
        <div className='flex gap-2'>
          {/* Checkbox */}
          <input type="checkbox" className="mr-2" />

          {/* Edit Button */}
          <button onClick={() => openEditModal(branch)}>
            <FaPen className='text-blue-500 cursor-pointer hover:text-blue-700' />
          </button>

          {/* View Button */}
          <button onClick={() => openViewModal(branch.BranchCode)}>
              <FaEye className='ml-1 text-indigo-500 cursor-pointer hover:text-indigo-700' />
          </button>


          {/* Delete Button */}
          <button onClick={() => deleteBranch(branch.id)}>
            <FaTrashAlt className='ml-1 text-red-500 cursor-pointer hover:text-red-700' />
          </button>
        </div>
      </td>
      <td className="px-4 py-4 border-r">{branch.companyCode}</td>
      <td className="px-4 py-4 border-r">{branch.branchCode}</td>
      <td className="px-4 py-4 border-r">{branch.khName}</td>
      <td className="px-4 py-4 border-r">{branch.engName}</td>
      <td className="px-4 py-4 border-r">{branch.phone}</td>
      <td className="px-4 py-4 border-r">{branch.address}</td>
      <td className="px-4 py-4 border-r">{branch.email}</td>
      <td className="px-4 py-4 border-r">{branch.vatNo}</td>
      <td className="px-4 py-4 border-r">{branch.bankName}</td>
      <td className="px-4 py-4 border-r">{branch.bankAccName}</td>
      <td className="px-4 py-4 border-r">{branch.bankAccNo}</td>
      <td className="px-4 py-4 border-r">{branch.bankBranch}</td>
      <td className="px-4 py-4 border-r">{branch.companyLogo}</td>
      <td className="px-4 py-4 border-r">{branch.LastBy}</td>
      <td className="px-4 py-4 border-r">{branch.LastDate}</td>
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
                        className={`flex items-center justify-center py-2 px-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500   ${currentPage === page ? 'bg-blue-500 text-white border-blue-600' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'}`}
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
                    className={`flex items-center justify-center py-2 px-3 text-gray-500 bg-white border rounded-lg shadow-sm hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500   ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl sm:max-w-5xl md:max-w-4xl lg:max-w-2xl bg-white rounded-md shadow-lg overflow-auto max-h-[90vh] h-[73vh] sm:h-[550px] md:h-[450px] modal-scrollbar mt-14 sm:ml-52 md:ml-0" data-aos='zoom-in'>
            <div className="sticky top-0 z-50 flex items-center justify-between w-full p-4 py-4 mb-6 bg-gray-100 border-b-2 border-gray-300 border-dashed">
              <h2 className="flex-1 ml-3 text-xl font-medium text-blue-800 sm:text-2xl md:text-2xl font-khmer leading-2">
                បញ្ចូលព័ត៌មានសាខា
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)} // Close modal function
                className="px-2 py-2 mr-2 text-gray-500 bg-gray-100 rounded-md hover:text-gray-700 ring-1 ring-gray-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="px-8">
              <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSave}> {/* Form submission handler */}
                {/* Company Code Dropdown */}
                <div className='mb-4'>
                  <label htmlFor="companyCode" className='block text-sm font-medium text-gray-700'>Company Code</label>
                  <Select
                    options={optionsCompany}
                    onChange={handleCompanyChange}
                    placeholder="Select Department"
                    // value={optionsCompany.find(option => option.value === formData.companyCode)}
                    isClearable        
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />

                  {/* Display selected company code */}
                  {formData.companyCode && (
                    <p className="mt-2 text-sm text-gray-600">Selected Company Code: {formData.companyCode}</p>
                  )}
                </div>

                {/* Branch Code Input */}
                <div className='mb-4'>
                  <label htmlFor="branchCode" className='block text-sm font-medium text-gray-700'>Branch Code</label>
                  <input 
                    type="text" 
                    id='branchCode'
                    name="branchCode" // Added name attribute for form data
                    value={formData.branchCode} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>

                {/* Branch Name Input */}
                <div className='mb-4'>
                  <label htmlFor="engName" className='block text-sm font-medium text-gray-700'>English Name</label>
                  <input 
                    type="text" 
                    id='engName'
                    name="engName" // Added name attribute for form data
                    value={formData.engName} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor="khName" className='block text-sm font-medium text-gray-700'>Khmer Name</label>
                  <input 
                    type="text" 
                    id='khName'
                    name="khName" // Added name attribute for form data
                    value={formData.khName} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor="phone" className='block text-sm font-medium text-gray-700'>Phone Number</label>
                  <input 
                    type="text" 
                    id='phone'
                    name="phone" // Added name attribute for form data
                    value={formData.phone} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor="address" className='block text-sm font-medium text-gray-700'>Address</label>
                  <input 
                    type="text" 
                    id='address'
                    name="address" // Added name attribute for form data
                    value={formData.address} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email</label>
                  <input 
                    type="text" 
                    id='email'
                    name="email" // Added name attribute for form data
                    value={formData.email} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor="vatNo" className='block text-sm font-medium text-gray-700'>VAT Number</label>
                  <input 
                    type="text" 
                    id='vatNo'
                    name="vatNo" // Added name attribute for form data
                    value={formData.vatNo} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>

                
                <div className='mb-4'>
                  <label htmlFor="bankName" className='block text-sm font-medium text-gray-700'>Bank Name</label>
                  <input 
                    type="text" 
                    id='bankName'
                    name="bankName" // Added name attribute for form data
                    value={formData.bankName} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor="bankAccName" className='block text-sm font-medium text-gray-700'>Bank Account Name</label>
                  <input 
                    type="text" 
                    id='bankAccName'
                    name="bankAccName" // Added name attribute for form data 
                    value={formData.bankAccName} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor="bankAccNo" className='block text-sm font-medium text-gray-700'>Bank Account No</label>
                  <input 
                    type="text" 
                    id='bankAccNo'
                    name="bankAccNo" // Added name attribute for form data
                    value={formData.bankAccNo} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor="bankBranch" className='block text-sm font-medium text-gray-700'>Bank Branch</label>
                  <input 
                    type="text" 
                    id='bankBranch'
                    name="bankBranch" // Added name attribute for form data
                    value={formData.bankBranch} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor="companyLogo" className='block text-sm font-medium text-gray-700'>Company Logo</label>
                  <input 
                    type="file" 
                    id='companyLogo'
                    name="companyLogo" // Added name attribute for form data
                    value={formData.companyLogo} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>
                
              </form>
              <div className="flex justify-center gap-5 p-6 mt-4">
                  <button
                    type="submit" // Submit button
                    onClick={handleSave}
                    className="px-8 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                  >
                    <p className='text-base font-normal'>រក្សាទុក</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)} // Close modal function
                    className="px-6 py-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 border-dashed rounded-lg shadow-sm hover:bg-gray-100"
                  >
                    <p className='text-base font-normal'>ចាកចេញ</p>
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}


      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl sm:max-w-5xl md:max-w-4xl lg:max-w-2xl bg-white rounded-md shadow-lg overflow-auto max-h-[90vh] h-[73vh] sm:h-[550px] md:h-[450px] modal-scrollbar mt-14 sm:ml-52 md:ml-0" data-aos='zoom-in'>
            <div className="sticky top-0 z-50 flex items-center justify-between w-full p-4 py-4 mb-6 bg-gray-100 border-b-2 border-gray-300 border-dashed">
              <h2 className="flex-1 ml-3 text-xl font-medium text-blue-800 sm:text-2xl md:text-2xl font-khmer leading-2">
                កែប្រែព័ត៌មានសាខា
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)} // Close modal function
                className="px-2 py-2 mr-2 text-gray-500 bg-gray-100 rounded-md hover:text-gray-700 ring-1 ring-gray-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="px-8">
              <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSave}> {/* Form submission handler */}
                {/* Company Code Dropdown */}
                <div className='mb-4'>
                  <label htmlFor="companyCode" className='block text-sm font-medium text-gray-700'>Company Code</label>
                  <Select
                    options={optionsCompany}
                    onChange={handleCompanyChange}
                    placeholder="Select Department"
                    // value={optionsCompany.find(option => option.value === formData.companyCode)}
                    isClearable        
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />

                  {/* Display selected company code */}
                  {formData.companyCode && (
                    <p className="mt-2 text-sm text-gray-600">Selected Company Code: {formData.companyCode}</p>
                  )}
                </div>

                {/* Branch Code Input */}
                <div className='mb-4'>
                  <label htmlFor="branchCode" className='block text-sm font-medium text-gray-700'>Branch Code</label>
                  <input 
                    type="text" 
                    id='branchCode'
                    name="branchCode" // Added name attribute for form data
                    value={formData.branchCode} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>

                {/* Branch Name Input */}
                <div className='mb-4'>
                  <label htmlFor="engName" className='block text-sm font-medium text-gray-700'>English Name</label>
                  <input 
                    type="text" 
                    id='engName'
                    name="engName" // Added name attribute for form data
                    value={formData.engName} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor="khName" className='block text-sm font-medium text-gray-700'>Khmer Name</label>
                  <input 
                    type="text" 
                    id='khName'
                    name="khName" // Added name attribute for form data
                    value={formData.khName} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor="phone" className='block text-sm font-medium text-gray-700'>Phone Number</label>
                  <input 
                    type="text" 
                    id='phone'
                    name="phone" // Added name attribute for form data
                    value={formData.phone} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor="address" className='block text-sm font-medium text-gray-700'>Address</label>
                  <input 
                    type="text" 
                    id='address'
                    name="address" // Added name attribute for form data
                    value={formData.address} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email</label>
                  <input 
                    type="text" 
                    id='email'
                    name="email" // Added name attribute for form data
                    value={formData.email} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>

                <div className='mb-4'>
                  <label htmlFor="vatNo" className='block text-sm font-medium text-gray-700'>VAT Number</label>
                  <input 
                    type="text" 
                    id='vatNo'
                    name="vatNo" // Added name attribute for form data
                    value={formData.vatNo} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>

                
                <div className='mb-4'>
                  <label htmlFor="bankName" className='block text-sm font-medium text-gray-700'>Bank Name</label>
                  <input 
                    type="text" 
                    id='bankName'
                    name="bankName" // Added name attribute for form data
                    value={formData.bankName} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor="bankAccName" className='block text-sm font-medium text-gray-700'>Bank Account Name</label>
                  <input 
                    type="text" 
                    id='bankAccName'
                    name="bankAccName" // Added name attribute for form data 
                    value={formData.bankAccName} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor="bankAccNo" className='block text-sm font-medium text-gray-700'>Bank Account No</label>
                  <input 
                    type="text" 
                    id='bankAccNo'
                    name="bankAccNo" // Added name attribute for form data
                    value={formData.bankAccNo} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor="bankBranch" className='block text-sm font-medium text-gray-700'>Bank Branch</label>
                  <input 
                    type="text" 
                    id='bankBranch'
                    name="bankBranch" // Added name attribute for form data
                    value={formData.bankBranch} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor="companyLogo" className='block text-sm font-medium text-gray-700'>Company Logo</label>
                  <input 
                    type="file" 
                    id='companyLogo'
                    name="companyLogo" // Added name attribute for form data
                    value={formData.companyLogo} 
                    onChange={handleChange} 
                    className='block w-full p-2 mt-1 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                    required
                  />
                </div>
                
              </form>
              <div className="flex justify-center gap-5 p-6 mt-4">
                  <button
                    type="submit" // Submit button
                    onClick={handleUpdate}
                    className="px-8 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                  >
                    <p className='text-base font-normal'>រក្សាទុក</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)} // Close modal function
                    className="px-6 py-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 border-dashed rounded-lg shadow-sm hover:bg-gray-100"
                  >
                    <p className='text-base font-normal'>ចាកចេញ</p>
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}

      
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl sm:max-w-5xl md:max-w-4xl lg:max-w-2xl bg-white rounded-md shadow-lg overflow-auto max-h-[90vh] h-[73vh] sm:h-[550px] md:h-[450px] modal-scrollbar mt-14 sm:ml-52 md:ml-0" data-aos='zoom-in'>
            <div className="sticky top-0 z-50 flex items-center justify-between w-full p-4 py-4 mb-6 bg-gray-100 border-b-2 border-gray-300 border-dashed">
              <h2 className="flex-1 ml-3 text-xl font-medium text-blue-800 sm:text-2xl md:text-2xl font-khmer leading-2">
                មើលព័ត៌មានសាខា
              </h2>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)} // Close view modal
                className="px-2 py-2 mr-2 text-gray-500 bg-gray-100 rounded-md hover:text-gray-700 ring-1 ring-gray-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="px-4">
              <form className="space-y-4"> 
                {/* Company Code (Read-Only) */}
                <div className='mb-4'>
                  <label htmlFor="CompanyCode" className='block text-sm font-medium text-gray-700'>Company Code</label>
                  <input 
                    type="text" 
                    id="CompanyCode" 
                    value={formData.CompanyCode} 
                    readOnly
                    className='block w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                  />
                </div>

                {/* Branch Code (Read-Only) */}
                <div className='mb-4'>
                  <label htmlFor="BranchCode" className='block text-sm font-medium text-gray-700'>Branch Code</label>
                  <input 
                    type="text" 
                    id="BranchCode" 
                    value={formData.BranchCode} 
                    readOnly
                    className='block w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                  />
                </div>

                {/* Branch Name (Read-Only) */}
                <div className='mb-4'>
                  <label htmlFor="Branch" className='block text-sm font-medium text-gray-700'>Branch Name</label>
                  <input 
                    type="text" 
                    id="Branch" 
                    value={formData.Branch} 
                    readOnly
                    className='block w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1'
                  />
                </div>

                <div className="flex justify-center gap-5 p-6 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsViewModalOpen(false)} // Close modal function
                    className="px-6 py-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 border-dashed rounded-lg shadow-sm hover:bg-gray-100"
                  >
                    <p className='text-base font-normal'>បិទ</p>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Branch;
