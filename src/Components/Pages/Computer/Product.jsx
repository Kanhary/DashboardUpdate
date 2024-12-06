import React, { useState, useEffect } from 'react';
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Select from 'react-select';
import { IoMdRefresh } from "react-icons/io";
import Swal from 'sweetalert2';
import { GetProduct, GetCategory ,GetSubCategory, AddProduct, GetUserLogin,UpdateProduct, DeleteProduct} from '../../../api/user';
import Category from './Category';

const Product = () => {
  
  const INITAIL_FORM_DATA = { productCode: '', engName: '', khName: '', categoryId: '',subCategoryId: '',model: '', serialNumber: '', purchaseDate: '', wanrreantyExpiration: '',location: '',unitorSet: '', price: '', ipAddress: '', macAddress: ''}
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITAIL_FORM_DATA);
  const [editingComputer, setEditingComputer] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [Computers, setComputer] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategory] = useState([]);
  const [SubCategories, setSubCategory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // const DepList = [
  //   { CompanyCode: 'PPAP', DepartmentCode: 'Dep-admin', Department: 'នាយកដ្ឋាន រដ្ឋបាល',  BranchCode: 'TS3' },
  //   { CompanyCode: 'PPAP', DepartmentCode: 'Dep-HR', Department: 'នាយកដ្ឋាន បុគ្គលិក/ធនធានមនុស្ស',  BranchCode: 'TS3' },
    
  // ];
  
  useEffect(() => {
    const fetchComputer = async () => {
      try {
        const response = await GetProduct();
        console.log(response.data.data); 
        setComputer(response.data.data);
        
      } catch (err) {
        setError({ message: err.message || 'An error occurred' });
      }
    };
    const fetchCategory = async () => {
        try {
          const response = await GetCategory();
          console.log(response.data.data); 
          setCategory(response.data.data);
          
        } catch (err) {
          setError({ message: err.message || 'An error occurred' });
        }
    };
    const fetchSubCategory = async () => {
        try {
          const response = await GetSubCategory();
          console.log(response.data.data); 
          setSubCategory(response.data.data);
          
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
    
    fetchSubCategory();
    fetchCategory();
    fetchComputer();
  }, []);

  // useEffect(() => {
  //   const fetchBranch = async () => {
  //     try{
  //       const response = await 
  //     }
  //   }
  // }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const filteredComputer = Computers.filter(computer =>
    computer.engName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    computer.productCode.includes(searchTerm)
);

  const totalPages = Math.ceil(filteredComputer.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentComputer = filteredComputer.slice(indexOfFirstRecord, indexOfLastRecord);

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

  const openEditModal = (computer) => {
    setEditingComputer(computer);
    setFormData(computer);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingComputer(null);
    setFormData(INITAIL_FORM_DATA);
    setIsEditModalOpen(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveNew = () => {
    console.log('Save & New clicked', formData);
    setFormData(INITAIL_FORM_DATA);
  };

  const handleSave = async () => {
    // Prepare the data for submission
    const updatedFormData = {
      ...formData,
      id: formData.categoryId || '',
      id: formData.subCatogryId,
      createdby: currentUser,
      lastby: currentUser,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };
  
    try {
      // Call your API to save the data
      const response = await AddProduct(updatedFormData);
  
      // Show success alert
      Swal.fire({
        title: "Saved!",
        text: "Product has been saved successfully.",
        icon: "success",
        confirmButtonText: "Okay",
      });
  
      console.log('API Response:', response);
      closeAddModal(); // Close the modal on successful save
    } catch (error) {
      console.error('Error saving data', error);
  
      // Show error alert if something goes wrong
      Swal.fire({
        title: "Error!",
        text: "Failed to save product.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };
  

  const handleUpdate = async () => {
    try {
      console.log('Saving product data:', formData);
      const id = formData.id;  // Ensure this is valid
      if (!id) {
        Swal.fire({
          title: "Error",
          text: "product ID is missing",
          icon: "warning"
        });
        return;
      }
  
      const response = await UpdateProduct(id, formData);
  
      if (response.status === 200) {
        console.log('product updated successfully:', response.data);
        Swal.fire({
          title: "Successful",
          text: "product updated successfully",
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

  const deleteProduct = async (id) => {
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
            // Call DeleteOffice function to send the API request
            const response = await DeleteProduct(id); // Pass the office id here
            console.log('Response:', response);  // Log the response to confirm deletion
  
            if (response.status === 200) {  // Check for successful response
                Swal.fire({
                    title: "Deleted!",
                    text: "Product has been deleted.",
                    icon: "success",
                    confirmButtonText: "Okay",
                });
  
                // Remove the deleted office from the list
                const updatedProduct = Computers.filter(computer => computer.id !== id);
                setComputer(updatedProduct);  // Update the state with the remaining offices
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete Sub-Category.",
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

  const handleBranchChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      BranchCode: selectedOption ? selectedOption.value : '',
    }));
  };

  const handleCompanyCodeChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      CompanyCode: selectedOption ? selectedOption.value : '',
    }));
  }


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
  const optionsBranch = [
    {value: 'TS3', label: 'TS3'},
    {value: 'LM17', label: 'LM17'},
    
  ]
  const handleUnitOrSet = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      unitorSet: selectedOption ? selectedOption.value : '',
    }));
  };
  const optionUnitOrSet = [
    {value: 'unit', label: 'Unit'},
    {value: 'set', label: 'Set'}
  ]
  // const optionsBranch = branch.map(branch => ({
  //   value: branch.BranchCode,
  //   label: `${branch.BranchCode} - ${branch.BranchName}`
  // }));

  const optionsCategoryId = categories.map(category => ({
    value: category.id,
    label: `${category.categoryCode}-${category.categoryName}`
  }));

  const optionsSubCategoryId = SubCategories.map(subCategory => ({
    value: subCategory.id,
    label: `${subCategory.subCategoryCode}-${subCategory.subCategoryName}`
  }));

  const handleSubCategoryId = (option) => {
    console.log('Selected option:', option); // Check if selectedOption has the correct value
    setSelectedOption(option);
    setFormData((prevData) => ({
      ...prevData,
      subCategoryId: option ? option.value : '',
    }));
  };

  const handleCategoryId = (option) => {
    console.log('Selected option:', option); // Check if selectedOption has the correct value
    setSelectedOption(option);
    setFormData((prevData) => ({
      ...prevData,
      categoryId: option ? option.value : '',
    }));
  };
  


  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <section className='mt-10 font-khmer'>
      <h1 className='text-xl font-medium text-blue-800'>តារាងកុំព្យូទ័រ</h1>
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
                      <path fillRule="evenodd" d="M8 4a4  4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id='simple-search'
                    className='block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500'
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
          
          <div className='w-full overflow-x-auto' data-aos='fade-right'>
            <table className='w-full text-sm text-left text-gray-500'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-100 border'>
                <tr>
                  <th scope="col" className="sticky left-0 px-4 py-3 bg-gray-100 border-r">Action</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '180px'}}>Product Code</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '180px'}}>English Name</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '250px'}}>Khmer Name</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '150px'}}>Category</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '150px'}}>SubCategory</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '150px'}}>Model</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '150px'}}>Serial Number</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '150px'}}>Purchase Date</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '150px'}}>Warrenty Expiration</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '150px'}}>Location</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '150px'}}>Unit or Set</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '150px'}}>Price</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '150px'}}>IP Address</th>
                  <th scope="col" className="px-4 py-3 border-r" style={{minWidth: '150px'}}>Mac Address</th>
                  
                </tr>
              </thead>
              <tbody>
                {currentComputer.map((computer, index) => (
                  <tr key={computer.id} className='transition-colors duration-200 border border-b-gray-200 hover:bg-indigo-50'>
                    <td className='sticky left-0 flex px-6 py-5 bg-white border-r'>
                      <div className="flex items-center justify-center space-x-3">
                        <input type="checkbox" className="mr-1 action-checkbox"/>
                        <FaPen className="ml-2 text-blue-500 cursor-pointer hover:text-blue-700" onClick={() => openEditModal(computer)} />
                        <FaTrashAlt className="ml-2 text-red-500 cursor-pointer hover:text-red-700" onClick={() => deleteProduct(computer.id)} />
                      </div>
                    </td>
                    <td className='px-4 py-4 border-r'>{computer.productCode}</td>
                    <td className='px-4 py-4 border-r'>{computer.khName}</td>
                    <td className='px-4 py-4 border-r'>{computer.engName}</td>
                    <td className='px-4 py-4 border-r'>{computer.categoryId}</td>
                    <td className='px-4 py-4 border-r'>{computer.subCategoryId}</td>
                    <td className='px-4 py-4 border-r'>{computer.model}</td>
                    <td className='px-4 py-4 border-r'>{computer.serialNumber}</td>
                    <td className='px-4 py-4 border-r'>{computer.purchaseDate}</td>
                    <td className='px-4 py-4 border-r'>{computer.wanrreantyExpiration}</td>
                    <td className='px-4 py-4 border-r'>{computer.location}</td>
                    <td className='px-4 py-4 border-r'>{computer.unitorSet}</td>
                    <td className='px-4 py-4 border-r'>{computer.price}</td>
                    <td className='px-4 py-4 border-r'>{computer.ipAddress}</td>
                    <td className='px-4 py-4 border-r'>{computer.macAddress}</td>
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

      {/* Add Office Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative mx-auto transition-all transform bg-white shadow-2xl rounded-xl h-[700px] overflow-y-auto w-[1000px]" data-aos='zoom-in'>
            <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
              <h2 className="text-xl font-bold text-white md:text-2xl">បន្ថែមនាយកដ្ឋានថ្មី</h2>
              <button onClick={closeAddModal} className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl">
                &times;
              </button>
            </header>
            <div className="px-6 py-6 space-y-6">
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label htmlFor="productCode" className="block mb-2 text-sm font-semibold text-gray-700">Product Code</label>
                  <input
                    id="productCode"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.productCode}
                    onChange={handleChange}
                    required
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="engName" className="block mb-2 text-sm font-semibold text-gray-700">English Name</label>
                  <input
                    id="engName"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.engName}
                    onChange={handleChange}
                  />
                </div>
                
              </div>
                            <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label htmlFor="khName" className="block mb-2 text-sm font-semibold text-gray-700">Khmer Name</label>
                  <input
                    id="khName"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.khName}
                    onChange={handleChange}
                    required
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="CompanyCode" className="block mb-2 text-sm font-semibold text-gray-700">Category ID</label>
                  <Select
                    options={optionsCategoryId}
                    onChange={handleCategoryId}
                    placeholder="Select Company Code"
                    value={optionsCategoryId.find(option => option.value === formData.categoryId)}
                    isClearable
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>
                
              </div>
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label htmlFor="subCatogryId" className="block mb-2 text-sm font-semibold text-gray-700">Sub-Category ID</label>
                  <Select
                    options={optionsSubCategoryId}
                    onChange={handleSubCategoryId}
                    placeholder="Select Company Code"
                    value={optionsSubCategoryId.find(option => option.value === formData.subcategoryId)}
                    isClearable
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="model" className="block mb-2 text-sm font-semibold text-gray-700">Model</label>
                  <input
                    id="model"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </div>
                
              </div>

              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label htmlFor="serialNumber" className="block mb-2 text-sm font-semibold text-gray-700">Serial Number</label>
                  <input
                    id="serialNumber"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="purchaseDate" className="block mb-2 text-sm font-semibold text-gray-700">Purchase Date</label>
                  <input
                    type='date'
                    id="purchaseDate"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                  />
                </div>
                
              </div>
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label htmlFor="productCode" className="block mb-2 text-sm font-semibold text-gray-700">Warranty Expiration</label>
                  <input
                    id="serialNumber"
                    type='date'
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="location" className="block mb-2 text-sm font-semibold text-gray-700">Location</label>
                  <input
                   
                    id="location"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                
              </div>

              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
              <div className="w-full md:w-1/2">
                  <label htmlFor="CompanyCode" className="block mb-2 text-sm font-semibold text-gray-700">Unit Or Set</label>
                  <Select
                    options={optionUnitOrSet}
                    onChange={handleUnitOrSet}
                    placeholder="Select Company Code"
                    value={optionUnitOrSet.find(option => option.value === formData.unitorSet)}
                    isClearable
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="engName" className="block mb-2 text-sm font-semibold text-gray-700">Price</label>
                  <input
                   
                    id="price"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                
              </div>
                            <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label htmlFor="productCode" className="block mb-2 text-sm font-semibold text-gray-700">IP Address</label>
                  <input
                    id="ipAddress"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.ipAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="engName" className="block mb-2 text-sm font-semibold text-gray-700">Mac Address</label>
                  <input
                    
                    id="macAddress"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.macAddress}
                    onChange={handleChange}
                  />
                </div>
                
              </div>

              
            </div>
            <footer className="flex flex-col-reverse items-center justify-end px-6 py-4 space-y-3 space-y-reverse bg-gray-100 rounded-b-xl md:flex-row md:space-x-3 md:space-y-0">
              <button onClick={handleSaveNew} className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto">
                Save & New
              </button>
              <button onClick={handleSave} className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-green-500 to-green-700 hover:shadow-lg hover:scale-105 md:w-auto">
                Save
              </button>
              <button onClick={closeAddModal} className="w-full px-5 py-2 text-sm font-medium text-gray-700 transition duration-200 transform bg-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 md:w-auto">
                Cancel
              </button>
            </footer>
          </div>
        </div>
      )}


    {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative mx-auto transition-all transform bg-white shadow-2xl rounded-xl h-[700px] overflow-y-auto w-[1000px]" data-aos='zoom-in'>
            <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
              <h2 className="text-xl font-bold text-white md:text-2xl">បន្ថែមនាយកដ្ឋានថ្មី</h2>
              <button onClick={closeAddModal} className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl">
                &times;
              </button>
            </header>
            <div className="px-6 py-6 space-y-6">
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label htmlFor="productCode" className="block mb-2 text-sm font-semibold text-gray-700">Product Code</label>
                  <input
                    id="productCode"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.productCode}
                    onChange={handleChange}
                    required
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="engName" className="block mb-2 text-sm font-semibold text-gray-700">English Name</label>
                  <input
                    id="engName"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.engName}
                    onChange={handleChange}
                  />
                </div>
                
              </div>
                            <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label htmlFor="khName" className="block mb-2 text-sm font-semibold text-gray-700">Khmer Name</label>
                  <input
                    id="khName"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.khName}
                    onChange={handleChange}
                    required
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="CompanyCode" className="block mb-2 text-sm font-semibold text-gray-700">Category ID</label>
                  <Select
                    options={optionsCategoryId}
                    onChange={handleCategoryId}
                    placeholder="Select Company Code"
                    value={optionsCategoryId.find(option => option.value === formData.categoryId)}
                    isClearable
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>
                
              </div>
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label htmlFor="subCatogryId" className="block mb-2 text-sm font-semibold text-gray-700">Sub-Category ID</label>
                  <Select
                    options={optionsSubCategoryId}
                    onChange={handleSubCategoryId}
                    placeholder="Select Company Code"
                    value={optionsSubCategoryId.find(option => option.value === formData.subcategoryId)}
                    isClearable
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="model" className="block mb-2 text-sm font-semibold text-gray-700">Model</label>
                  <input
                    id="model"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </div>
                
              </div>

              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label htmlFor="serialNumber" className="block mb-2 text-sm font-semibold text-gray-700">Serial Number</label>
                  <input
                    id="serialNumber"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="purchaseDate" className="block mb-2 text-sm font-semibold text-gray-700">Purchase Date</label>
                  <input
                    type='date'
                    id="purchaseDate"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                  />
                </div>
                
              </div>
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label htmlFor="productCode" className="block mb-2 text-sm font-semibold text-gray-700">Warranty Expiration</label>
                  <input
                    id="serialNumber"
                    type='date'
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="location" className="block mb-2 text-sm font-semibold text-gray-700">Location</label>
                  <input
                   
                    id="location"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                
              </div>

              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
              <div className="w-full md:w-1/2">
                  <label htmlFor="CompanyCode" className="block mb-2 text-sm font-semibold text-gray-700">Unit Or Set</label>
                  <Select
                    options={optionUnitOrSet}
                    onChange={handleUnitOrSet}
                    placeholder="Select Company Code"
                    value={optionUnitOrSet.find(option => option.value === formData.unitorSet)}
                    isClearable
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="engName" className="block mb-2 text-sm font-semibold text-gray-700">Price</label>
                  <input
                   
                    id="price"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
                
              </div>
                            <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label htmlFor="productCode" className="block mb-2 text-sm font-semibold text-gray-700">IP Address</label>
                  <input
                    id="ipAddress"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.ipAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
               
                <div className="w-full md:w-1/2">
                  <label htmlFor="engName" className="block mb-2 text-sm font-semibold text-gray-700">Mac Address</label>
                  <input
                    
                    id="macAddress"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.macAddress}
                    onChange={handleChange}
                  />
                </div>
                
              </div>

              
            </div>
            <footer className="flex flex-col-reverse items-center justify-end px-6 py-4 space-y-3 space-y-reverse bg-gray-100 rounded-b-xl md:flex-row md:space-x-3 md:space-y-0">
              
              <button onClick={handleUpdate} className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-green-500 to-green-700 hover:shadow-lg hover:scale-105 md:w-auto">
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

export default Product;
