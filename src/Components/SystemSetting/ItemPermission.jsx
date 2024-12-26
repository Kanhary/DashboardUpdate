import React, { useState, useEffect } from 'react';
import { FaPen, FaTrashAlt } from "react-icons/fa"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { IoMdRefresh } from "react-icons/io";
import { GetMenu } from '../../api/user';


const ItemPermission = () => {
  const INITAIL_FORM_DATA = {code: '', functionCode: '',function: ''}
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITAIL_FORM_DATA);
  const [editingItemPermission,setEditingItemPermission] = useState(null);
  const [flattenedMenus, setFlattenedMenus] = useState([]);
  const [items, setItems] = useState([]);
  
  // const items = [
  //   {code: '001', functionCode: 'តារាងបង្ហាញទិន្នន័យ', functionName: 'Dashboard'},
  //   {code: '002', functionCode: 'តារាងទិន្នន័យកំុព្យូទ័រ', functionName: 'Computer'},
  //   {code: '003', functionCode: 'តារាងបញ្ញីបុគ្គលិក', functionName: 'Employee Position List'},
  //   {code: '004', functionCode: 'តារាងបញ្ញីភេទបុគ្គលិក',functionName: 'Gender List'},
  //   {code: '005', functionCode: 'តារាងបញ្ចូលព័ត៌មានបុគ្គលិក', functionName: 'Employee Information'},
  //   {code: '006', functionCode: 'អ្នកប្រើប្រាស់', functionName: 'Users'},
  //   {code: '007', functionCode: 'GroupMaster', functionName: 'Group Master'},
  //   {code: '008', functionCode: 'ItemPermission', functionName: 'Item Permission'},
  //   {code: '009', functionCode: 'GroupDetail', functionName: 'Group Details'},
  //   {code: '0010', functionCode: 'Maintenance', functionName: 'Maintenance'},
  //   {code: '0011', functionCode: 'Report', functionName: 'Report'},
  //   {code: '0012', functionCode: 'Help', functionName: 'Help'},
    
  // ];

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchMenuItems = async () => {
      try {
        const response = await GetMenu();
        if (response.data.code === 200) {
          setItems(response.data.data);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setItems([]);
      }
    };

    fetchMenuItems();
  }, []);
  
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const filterItemPermission = items.filter(item =>
    item.menuName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
    item.id.includes(searchTerm)
  );
  const totalPages = Math.ceil(filterItemPermission.length / recordsPerPage);
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentMenus = flattenedMenus.slice(indexOfFirstRecord, indexOfLastRecord);

  console.log(currentMenus);  // Log the currentMenus array

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

  const openEditModal = (code, functionCode, functionName) => {
    setEditingItemPermission({ code, functionCode, functionName });
    setFormData({ code, functionCode, functionName });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingItemPermission(null);
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

  const handleSave = () => {
    console.log('Save clicked', formData);
    closeAddModal();
    closeEditModal();
  };

  const handleUpdate = () => {
    console.log('Update clicked', formData);
    closeEditModal();
  };

  const handleClick = ()=>{
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
  }
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  return (
    <section className='mt-14 font-khmer'>
    <h1 className='text-xl font-medium text-blue-800'>ការអនុញ្ញាតអ្នកប្រើប្រាស់</h1>
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
            <table className='w-full text-sm text-left text-gray-500 '>
              <thead className='text-xs text-gray-700 uppercase bg-gray-100 border-t-2'>
                <tr>
                  <th scope="col" className="sticky left-0 px-4 py-3 bg-gray-100 border-t border-r">Action</th>
                  <th scope="col" className="px-4 py-3 border-t border-r">Code</th>
                  {/* <th scope='col' className='px-4 py-3 border-t border-r' style={{ minWidth: '300px' }}>Function Code</th>
                  <th scope='col' className='px-4 py-3 border-t border-r' style={{ minWidth: '300px' }}>Function Name</th> */}
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{ minWidth: '150px' }}>Create By</th>
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{ minWidth: '150px' }}>Last By</th>
                  
                  <th scope="col" className="px-4 py-3 border-t border-r" style={{ minWidth: '150px' }}>Last Date</th>
                </tr>
              </thead>
              <tbody>
              {currentMenus.map((menu) => (
                <tr
                  key={menu.id}
                  className={`text-sm text-gray-700 hover:bg-gray-50 ${
                    menu.isChild ? "pl-8" : "" // Indent child menus
                  }`}
                >
                  {/* Parent/Child Menu Name */}
                  <td className={`px-4 py-2 border ${menu.isChild ? "pl-8" : ""}`}>
                    {translateText(menu.menuName)}
                  </td>

                  {/* Permission Checkbox */}
                  <td className="px-4 py-2 text-center border">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600"
                      checked={roleMenuPermissions.some(
                        (permission) => permission.menuId === menu.id && permission.enabled
                      )}
                      onChange={() => (isEditing ? handleCheckboxChange(menu.id) : null)}
                      disabled={!isEditing}
                    />
                  </td>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-1/2 mx-auto transition-all transform bg-white shadow-2xl rounded-xl" data-aos='zoom-in'>
            <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
              <h2 className="text-xl font-bold text-white md:text-2xl">Add New Item Permission</h2>
              <button onClick={closeAddModal} className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl">
                &times;
              </button>
            </header>
            <div className="px-6 py-6 space-y-6">
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                {/* Input for Code */}
                <div className="w-full md:w-1/2">
                  <label htmlFor="code" className="block mb-2 text-sm font-semibold text-gray-700">Code</label>
                  <input
                    type="text"
                    id="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                  />
                </div>
                {/* Input for Position */}
                <div className="w-full md:w-1/2">
                  <label htmlFor="functionCode" className="block mb-2 text-sm font-semibold text-gray-700">Function Code</label>
                  <input
                    type="text"
                    id="functionCode"
                    value={formData.functionCode}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="functionName" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Function Name</label>
                <textarea
                  id="functionName"
                  value={formData.functionName}
                  onChange={handleChange}
                  className="block w-full h-10 px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm resize-none bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                />
              </div>

            </div>
            <footer className="flex flex-col-reverse items-center justify-end px-6 py-4 space-y-3 space-y-reverse bg-gray-100 rounded-b-xl md:flex-row md:space-x-3 md:space-y-0">
              
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

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-1/2 mx-auto transition-all transform bg-white shadow-2xl rounded-xl">
            <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
              <h2 className="text-xl font-bold text-white md:text-2xl">Add New Item Permission</h2>
              <button onClick={closeEditModal} className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl">
                &times;
              </button>
            </header>
            <div className="px-6 py-6 space-y-6">
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                {/* Input for Code */}
                <div className="w-full md:w-1/2">
                  <label htmlFor="code" className="block mb-2 text-sm font-semibold text-gray-700">Code</label>
                  <input
                    type="text"
                    id="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    disabled
                  />
                </div>
                {/* Input for Position */}
                <div className="w-full md:w-1/2">
                  <label htmlFor="functionCode" className="block mb-2 text-sm font-semibold text-gray-700">Function Code</label>
                  <input
                    type="text"
                    id="functionCode"
                    value={formData.functionCode}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="functionName" className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Function Name</label>
                <textarea
                  id="functionName"
                  value={formData.functionName}
                  onChange={handleChange}
                  className="block w-full h-10 px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm resize-none bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                />
              </div>

            </div>
            <footer className="flex flex-col-reverse items-center justify-end px-6 py-4 space-y-3 space-y-reverse bg-gray-100 rounded-b-xl md:flex-row md:space-x-3 md:space-y-0">
              
              <button onClick={handleSave} className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto">
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

  )
}

export default ItemPermission
