// MaintenancePage.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaLaptop, FaHdd, FaUser, FaClock } from "react-icons/fa";
// import { FaHardDrive, FaUser, FaClock } from 'react-icons/fa'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GetAllComputer, GetProduct, GetMaintenance, AddNewMaintenance, UpdateMaintenance, DeleteMaintenance, GetFile, GetSubCategory } from '../../api/user';
import Select from "react-select";
import Swal from "sweetalert2";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import axios from 'axios';

const MaintenancePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const computersPerPage = 5;
  const [data, setData] = useState([]);
  const [selectStaff, setSelectStaff] = useState("");
  const [selectComputer, setSelectComputer] = useState("");
  const [formData, setFormData] = useState({productId: '', lastMaintenance: new Date().toISOString().split("T")[0],subCategoryId: '', technician: '', users: '', history: '', activeDate: new Date().toISOString().split("T")[0],})
  const [maintenanceData, setMaintenaceData] = useState([]);
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("បន្ថែម");
  const [detailTab, setDetailTab] = useState("Details");
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  // const [maintenanceId, setMaintenanceId] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [files, setFile] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState("");
  const [subCate, setSubCate] = useState([]);

  const fetchMaintenace = async () => {
    try {
      const response = await GetMaintenance();
      console.log("Get Staff code :", response.data.data);
      setMaintenaceData(response.data.data);
    } catch (err) {
      setError({ message: err.message || "An error occurred" });
    }
  };

  useEffect(() => {
    // console.log(" useEffect Triggered - Checking maintenanceId...");
    console.log("Maintenance ID:", selectedComputer?.id);
  
    if (detailTab === "ឯកសារយោង" && selectedComputer?.id) {
      fetchFiles(selectedComputer.id);
    }

    const fetchSubCategory = async () => {
      try {
        const response = await GetSubCategory(); // Call the API to get the subcategories
        console.log("Fetched subcategories:", response.data); // Check the actual structure of the response
        setSubCate(response.data.data); // Set the subcategories array (assuming it contains the necessary data)
      } catch (error) {
        console.error("Error fetching subcategory:", error);
      }
    };

    fetchSubCategory();
  }, [detailTab, selectedComputer]);
  

  const handleTabChange = (tab) => {
    console.log("Switching tab to:", tab);
    console.log("Selected Computer Data:", selectedComputer);
    console.log("Maintenance ID:", selectedComputer?.maintenanceId);
  
    setDetailTab(tab);
  
    if (tab === "ឯកសារយោង" && selectedComputer?.maintenanceId) {
      fetchFiles(selectedComputer.maintenanceId);
    }
  };
  
    


  const fetchFiles = async (maintenanceId) => {
    if (!maintenanceId) {
      console.warn("No maintenance ID found, skipping fetch.");
      return;
    }
  
    try {
      console.log(`🔍 Fetching files for Maintenance ID: ${maintenanceId}`);
      const response = await GetFile(maintenanceId);
      console.log("✅ Fetched files:", response.data.data);
  
      setFile(response.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching files:", err);
    }
  };
  

  

  useEffect(() => {
    const fetchComputer = async () => {
      try {
        const response = await GetProduct();
        console.log("Full API Response:", response); // Log the entire response
        console.log("Extracted Data:", response.data.data); // Log the expected data
    
        if (response.data.data) {
          setData(response.data.data);
        } else {
          console.error("Expected an array but got:", response.data.data);
          setData([]); // Prevent .map() errors
        }
      } catch (err) {
        console.error("API Error:", err);
        setError({ message: err.message || "An error occurred" });
        setData([]); // Set empty array to prevent crashes
      }
    };

    

    const fetchCurrentUser = async () => {
      try {
        const response = await GetUserLogin(); // Call the API to get the current user
        setCurrentUser(response.data.data.username); // Assuming the response contains a username field
        console.log("Fetched user:", response.data.data.username);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    const fetchFile = async () => {
      try {
         // const response = await GetFile(); // Call the API to get the current user
        setCurrentUser(response.data.data); // Assuming the response contains a username field
        console.log("Fetched user:", response.data.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
      
      fetchMaintenace();
      fetchComputer();
      fetchCurrentUser();
      fetchFile()
  }, []);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   setSelectedFile(file ? file.name : null);
  // };
  const openEditModal = (computer) => {
    setEditingMaintenance(computer);
  
    setFormData({
      ...computer,
      lastMaintenance: computer.lastMaintenance
        ? new Date(computer.lastMaintenance).toISOString().split("T")[0]
        : "",
      activeDate: computer.activeDate
        ? new Date(computer.activeDate).toISOString().split("T")[0]
        : "",
    });
  
    setIsEditModalOpen(true);
  };
  

  const handleStaffChange = (selectedOption) => {
    if (!selectedOption) {
      setSelectStaff(""); // Reset staff selection
      setSelectComputer(""); // Reset computer code
      return;
    }
  
    const deviceName = selectedOption.value;
    setSelectStaff(deviceName);
  
    // Ensure data is not undefined before accessing .find()
    const matchedRecord = data?.find((item) => item.deviceName === deviceName);
    setSelectComputer(matchedRecord ? matchedRecord.productCode : "");
  };
  
  // Ensure data is properly initialized to avoid runtime errors
  const optionStaffCode = data?.map((item) => ({
    value: item.deviceName,
    label: item.deviceName,
  })) || [];

  const optionMaintenanceId = maintenanceData?.map((maintenance) => ({
    value: maintenance.id,
    label: `${maintenance.id} - ${maintenance.users}`,
  })) || [];

  const handlemaintenanceId = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      maintenanceId: selectedOption ? selectedOption.value : "", // Store selected ID as maintenanceId
    }));
  };
  
  
  // const handleSave = async () => {
  //   // Prepare the data for submission
  //   const updatedFormData = {
  //     ...formData,
      
  //     productId: selectComputer || "", // Use plain string
  //     createdby: currentUser,
  //     createDate: new Date().toISOString(),
  //     lastdate: new Date().toISOString(),
  //   };
  
  //   try {
  //     // Call your API to save the data
  //     const response = await AddNewMaintenance(updatedFormData);
  
  //     // Show success alert
  //     Swal.fire({
  //       title: "Saved!",
  //       text: "Maintenance has been saved successfully.",
  //       icon: "success",
  //       confirmButtonText: "Okay",
  //     });
  
  //     console.log("API Response:", response);
  //     closeAddModal(); // Close the modal on successful save
  //     fetchMaintenace();
  //   } catch (error) {
  //     console.error("Error saving data", error);
  
  //     // Show error alert if something goes wrong
  //     Swal.fire({
  //       title: "Error!",
  //       text: "Failed to save maintenance.",
  //       icon: "error",
  //       confirmButtonText: "Okay",
  //     });
  //   }
  // };

  const handleSave = async () => {
    // Prepare the data for submission
    const updatedFormData = {
      productId: formData.productId,
      subCategoryId: formData.subcategoryId,  // Assuming it's from Select component
      users: formData.users,
      technician: formData.technician,
      lastMaintenance: formData.lastMaintenance,
      history: formData.history
    };
  
    try {
      // Call your API to save the data
      const response = await AddNewMaintenance(updatedFormData);
  
      // Show success alert
      Swal.fire({
        title: "Saved!",
        text: "Maintenance has been saved successfully.",
        icon: "success",
        confirmButtonText: "Okay",
      });
  
      console.log("API Response:", response);
  
      // Close modal and refresh maintenance data
      closeModal();
      // fetchMaintenance(); // Assuming you have a function to fetch the latest maintenance data
    } catch (error) {
      console.error("Error saving data", error);
  
      // Show error alert if something goes wrong
      Swal.fire({
        title: "Error!",
        text: "Failed to save maintenance.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!formData.id) {
      Swal.fire({
        title: "Error!",
        text: "Maintenance ID is missing.",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }
  
    // Prepare the data for submission
    const updatedFormData = {
      ...formData,
      lastBy: currentUser,
      lastDate: new Date().toISOString(),
    };
  
    try {
      // Call your API to update the maintenance record
      const response = await fetch(
        `http://192.168.168.4:8759/Maintenance/updateMaintenanceById/${formData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update maintenance.");
      }
  
      // Show success alert
      Swal.fire({
        title: "Updated!",
        text: "Maintenance record has been updated successfully.",
        icon: "success",
        confirmButtonText: "Okay",
      });
  
      console.log("API Response:", await response.json());
      closeEditModal(); // Close the modal on successful update
      fetchMaintenace(); // Refresh maintenance data
    } catch (error) {
      console.error("Error updating data", error);
  
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to update maintenance.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };
  

    const handleDelete = async (id) => {
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
            const response = await DeleteMaintenance(id, currentUser); // Pass the username here
            console.log("Response:", response); // Log the response to confirm the deletion
    
            if (response.status === 200) {
              // Check for a successful response
              Swal.fire({
                title: "Deleted!",
                text: "User has been deleted.",
                icon: "success",
                confirmButtonText: "Okay",
              });
    
              // Remove the deleted user from the list
              const updatedUsers = computer.filter((user) => user.id !== id);
              setFormData(updatedUsers);
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
          console.error(
            "Error:",
            error.response ? error.response.data : error.message
          );
          Swal.fire({
            title: "Error!",
            text:
              error.response?.data?.message || "Failed to connect to the server.",
            icon: "error",
            confirmButtonText: "Okay",
          });
        }
      };
  

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#fff",
      borderColor: "#9e9e9e",
      minHeight: "30px",
      height: "37px",
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: "30px",
      padding: "0 6px",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "30px",
    }),
  };

  // const maintenanceData = [
  //   {
  //     id: 1,
  //     computerName: 'PC-01',
  //     lastMaintenance: '2024-09-20',
  //     technician: 'Alice Johnson',
  //     hardwareHistory: [
  //       { type: 'CPU', model: 'Intel Core i7', date: '2024-06-15', notes: 'Upgraded from i5' },
  //       { type: 'RAM', capacity: '16GB DDR4', date: '2024-08-01', notes: 'Increased for multitasking' },
  //       { type: 'Storage', typeOfStorage: '512GB SSD', date: '2024-05-10', notes: 'Upgraded from 256GB SSD' },
  //     ],
  //     hardDisk: '1TB HDD',
  //     startDate: '2023-01-10',
  //     activeUser: { name: 'John Doe', 
  //     // role: 'Administrator', lastLogin: '2024-10-05', status: 'Active' 
  //   },
  //   },
  //   {
  //     id: 2,
  //     computerName: 'PC-02',
  //     lastMaintenance: '2024-09-25',
  //     technician: 'Bob Smith',
  //     hardwareHistory: [
  //       { type: 'CPU', model: 'AMD Ryzen 5', date: '2024-03-10', notes: 'Standard installation' },
  //       { type: 'RAM', capacity: '8GB DDR4', date: '2024-04-12', notes: 'Installed for regular usage' },
  //     ],
  //     hardDisk: '512GB SSD',
  //     startDate: '2023-05-15',
  //     activeUser: { name: 'Jane Doe', 
  //                   // role: 'User', lastLogin: '2024-10-06', status: 'Inactive' 
  //                 },
  //   },
  //   {
  //     id: 3,
  //     computerName: 'PC-03',
  //     lastMaintenance: '2024-09-20',
  //     technician: 'Alice Johnson',
  //     hardwareHistory: [
  //       { type: 'CPU', model: 'Intel Core i7', date: '2024-06-15', notes: 'Upgraded from i5' },
  //       { type: 'RAM', capacity: '16GB DDR4', date: '2024-08-01', notes: 'Increased for multitasking' },
  //       { type: 'Storage', typeOfStorage: '512GB SSD', date: '2024-05-10', notes: 'Upgraded from 256GB SSD' },
  //     ],
  //     hardDisk: '1TB HDD',
  //     startDate: '2023-01-10',
  //     activeUser: { name: 'John Doe', 
  //                   // role: 'Administrator', lastLogin: '2024-10-05', status: 'Active' 
  //                 },
  //   },
  // ];
  

  const filteredData = maintenanceData.filter(
    (computer) =>
      computer.users?.toLowerCase().includes(searchTerm?.toLowerCase()) 
    // ||
      // computer.productCode.includes(searchTerm)
  );
  

  const indexOfLastComputer = currentPage * computersPerPage;
  const indexOfFirstComputer = indexOfLastComputer - computersPerPage;
  const currentComputers = filteredData.slice(indexOfFirstComputer, indexOfLastComputer);
  const totalPages = Math.ceil(filteredData.length / computersPerPage);

  const getPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
        items.push(i);
    }
    return items;
};

  const closeModal = () => {
    setSelectedComputer(null);
  };


  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to array
    if (files.length > 0) {
      console.log("File selected:", files[0]); // Debugging
      setSelectedFiles(files);
    } else {
      setSelectedFiles([]);
    }
  };
  
  
  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      Swal.fire({
        title: "Error!",
        text: "Please select a valid file before uploading.",
        icon: "error",
      });
      return;
    }
  
    console.log("Selected Files:", selectedFiles);
  
    const formDataToSend = new FormData();
    formDataToSend.append("maintenanceId", formData.maintenanceId);
  
    const file = selectedFiles[0];
    if (!file || !(file instanceof File)) {
      console.error("Invalid file:", file);
      return;
    }
  
    // formDataToSend.append("fileData", file);
    formDataToSend.append("file", file); // 

    formDataToSend.append("description", formData.description);
  
    console.log("FormData before sending:");
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  
    try {
      const response = await axios.post(
        "http://192.168.168.4:8759/Docs/uploadFilePdf",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "File uploaded successfully.",
          icon: "success",
        });
        setSelectedFiles([]);
        setFormData((prev) => ({ ...prev, maintenanceId: "" }));
      } else {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to upload file.",
        icon: "error",
      });
    }
  };
  
  
  
  const handleFileClick = (selectedFileName) => {
    // Find the file from the state
    const file = files.find((file) => file.fileName === selectedFileName);
  
    if (!file || !file.fileData) {
      console.warn("File data not available.");
      return;
    }
  
    // Update state with the selected file
    setFileName(file.fileName);
    setFileData(file.fileData);
  
    // Convert Base64 to binary data
    const byteCharacters = atob(file.fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const fileBlob = new Blob([byteArray], { type: "application/pdf" });
  
    // Create a temporary URL for the file
    const fileURL = URL.createObjectURL(fileBlob);
  
    // Open the file in a new tab
    window.open(fileURL, "_blank");
  };
  

  const closeEditModal = (computer) => {
    setEditingUser(null);
    setFormData(computer);
    setIsEditModalOpen(false);
  };

  const optionSubCate = subCate?.map((sub) => ({
    value: sub.id,
    label: `${sub.id} - ${sub.subCategoryCode}`,
  })) || [];

  const optionTechnician = [
    { value: "ICT", label: "ICT" },
  ];
  const optionProductID = data?.map((computer) => ({
    value: computer.id,
    label: `${computer.id} - ${computer.deviceName}`,
  })) || [];


  const handleProductID = (selectedOption) => {
    setFormData({
      ...formData,
      productId: selectedOption ? selectedOption.value : "", // Update subcategoryId correctly
    });
  };

  const handleTechnician = (selectedOption) => {
    setFormData({
      ...formData,
      technician: selectedOption ? selectedOption.value : "", // Update subcategoryId correctly
    });
  };

  const handleSubCate = (selectedOption) => {
    setFormData({
      ...formData,
      subcategoryId: selectedOption ? selectedOption.value : "", // Update subcategoryId correctly
    });
  };





  return (
    <div className="min-h-screen mt-10">
      <h1 className='text-xl font-medium text-blue-800'>ការថែទាំ</h1>
      <div className='mt-3 border'></div>


      <div className='mt-4 bg-white rounded-md shadow-md'>
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
                className='block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-300 focus:border-primary-300 focus:ring-3 focus:outline-none'
                placeholder='Search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3" >
          {/* <label htmlFor="">Filter by Start Date : </label> */}
          <input
            type="date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='p-2 text-white bg-blue-600 border border-gray-300 rounded-lg'
          />
          <button
                type="button"
                className="flex items-center justify-center px-5 py-2 text-lg font-medium text-white transition-transform transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 hover:scale-105 active:scale-95"
                onClick={openAddModal}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                បន្ថែម
              </button>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className='text-xs text-gray-700 uppercase bg-gray-100 border-t-2'>
            <tr className="bg-gray-100 border-b">
              <th
                    scope="col"
                    className="sticky left-0 px-4 py-3 bg-gray-100 border-t border-r"
                  >
                    Action
              </th>
              <th className="p-4 py-3 border-r border-t">User</th>
              <th className="p-4 py-3 border-r border-t">Note</th>
              <th className="p-4 py-3 border-r border-t">Technician</th>
              <th className="p-4 py-3 border-r border-t">Last Maintenance</th>
              <th className="p-4 py-3 border-r border-t">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentComputers.map((computer) => (
              <tr key={computer.id} className="transition-colors duration-200 border border-b-gray-200 hover:bg-indigo-50">
                <td className="sticky left-0 z-10 flex items-center px-4 py-5 bg-white border-r">
                  <FaPen
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                    onClick={() => openEditModal(computer)}
                  />
                  <FaTrashAlt

                    className="ml-3 text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => handleDelete(computer.id)}
                  />
                </td>
                <td className="p-4 py-3 border-r font-semibold">{computer.users}</td>
              
                <td className="p-4 py-3 border-r">{computer.history}</td>
                <td className="p-4 py-3 border-r">{computer.technician}</td>
                <td className="p-4 py-3 border-r">
                  <span className="font-semibold">{computer.lastMaintenance}</span>
                </td>
                <td className="p-4 py-3">
                  <button
                    className="px-3 py-1 text-blue-500 transition hover:text-blue-600"
                    onClick={() => setSelectedComputer(computer)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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

      {/* details modal */}
      {selectedComputer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative mx-auto transition-all transform bg-white shadow-2xl rounded-xl h-[600px] overflow-y-auto w-[700px]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-2 border-b-2 border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FaLaptop className="text-blue-500" size={32} />
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900">
                  {selectedComputer.productId}
                </h3>
              </div>
              <button
                className="px-4 py-2 text-3xl font-semibold text-white transition-all duration-300 bg-red-500 rounded-lg shadow hover:bg-red-600 focus:outline-none"
                onClick={closeModal}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {/* Computer Details */}
            <div className='px-6'>
            <div className="w-full mb-4">
              <div className="flex space-x-4 border-b mb-6">
                <button
                  className={`p-2 ${
                    detailTab === "Details"
                      ? "border-b-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => handleTabChange("Details")}
                >
                  បន្ថែម
                </button>
                <button
                  className={`p-2 ${
                    detailTab === "ឯកសារយោង"
                      ? "border-b-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => handleTabChange("ឯកសារយោង")}
                >
                  ឯកសារយោង
                </button>
              </div>
              {detailTab === "Details" && (
                <div>
                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Last Maintenance:</p>
                      <p className="text-lg text-gray-900">{selectedComputer.lastMaintenance}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Technician:</p>
                      <p className="text-lg text-gray-900">{selectedComputer.technician}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Start Date:</p>
                      <p className="text-lg text-gray-900">{selectedComputer.activeDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Active User:</p>
                      <div className="flex items-center space-x-2">
                        <FaUser className="text-gray-500" />
                        <p className="text-lg text-gray-900">{selectedComputer.users}</p>
                      </div>
                    </div>  
                  </div>

                {/* Hardware History */}
                <h4 className="mb-4 text-xl font-semibold text-gray-800">Hardware History</h4>
                <ul className="mb-8 space-y-2 text-gray-700 list-disc list-inside">
                  {selectedComputer?.history ? (
                    selectedComputer.history.split("\r\n").map((historyItem, index) => (
                      <li key={index} className="leading-relaxed transition-colors duration-200 hover:text-blue-500">
                        <span>{historyItem}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No history available</li>
                  )}
                </ul>

                </div>
              )}

              {detailTab === "ឯកសារយោង" && (
                <div>
                  {isLoading ? (
                    <p className="text-gray-500">Loading files...</p>
                  ) : files.length > 0 ? (
                    <ul>
                      {files.map((file, index) => (
                        <li key={index} className="p-2 bg-gray-100 rounded-md mb-2">
                          <button
                            className="text-blue-500 hover:underline"
                            onClick={() => handleFileClick(file.fileName)}
                          >
                            {file.fileName}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No files available.</p>
                  )}
                </div>
              )}
            </div>

            </div>


            {/* Footer */}
            <div className="flex justify-end flex-shrink-0 p-4 space-x-4  rounded-b-xl">
              <button
                className="px-6 py-2 text-white transition-all duration-300 bg-blue-500 rounded-lg shadow hover:bg-blue-600 focus:outline-none"
                onClick={closeModal}
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen &&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
        <div className="relative mx-auto transition-all transform bg-white shadow-2xl rounded-xl w-[1000px] h-[550px] flex flex-col overflow-y-auto">
              <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
                <h2 className="text-xl font-bold text-white md:text-2xl">Add Maintenance</h2>
                <button onClick={closeAddModal} className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl">&times;</button>
              </header>
              <div className="w-full p-4">
                <div className="flex space-x-4 border-b">
                  <button className={`p-2 ${activeTab === "បន្ថែម" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab("បន្ថែម")}>បន្ថែម</button>
                  <button className={`p-2 ${activeTab === "ឯកសារយោង" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab("ឯកសារយោង")}>ឯកសារយោង</button>
                </div>
              </div>
      
      
              {activeTab === "បន្ថែម" &&(
                <div>
                  <div className="px-6 py-6 space-y-6">
                  <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                    <div className="w-full md:w-1/2">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Select Sub Category</label>
                      <Select
                          options={optionSubCate}
                          onChange={handleSubCate}
                          placeholder="Select Company Code"
                          value={optionSubCate.find(
                            (option) => option.value === formData.subcategoryId
                          )}
                          isClearable
                          className="basic-single"
                          classNamePrefix="select"
                          styles={customStyles}
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Product ID</label>
                      <Select
                          options={optionProductID}
                          onChange={handleProductID}
                          placeholder="Select Company Code"
                          value={optionProductID.find(
                            (option) => option.value === formData.productId
                          )}
                          isClearable
                          className="basic-single"
                          classNamePrefix="select"
                          styles={customStyles}
                        />
                    </div>
                    
      
                  </div>
      
                  <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                      <div className="w-full md:w-1/2">
                        <label
                          htmlFor="technician"
                          className="block mb-2 text-sm font-semibold text-gray-700"
                        >
                          Technician
                        </label>
                        <Select
                          options={optionTechnician}
                          onChange={handleTechnician}
                          placeholder="Select Company Code"
                          value={optionTechnician.find(
                            (option) => option.value === formData.technician
                          )}
                          isClearable
                          className="basic-single"
                          classNamePrefix="select"
                          styles={customStyles}
                        />
                      </div>
      
                      <div className="w-full md:w-1/2">
                        <label
                          htmlFor="user"
                          className="block mb-2 text-sm font-semibold text-gray-700"
                        >
                          User
                        </label>
                        <input
                          id="users"
                          className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                          value={formData.users}
                          onChange={handleChange}
                          required
                        />
                      </div>
      
                  </div>
                  <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  <div className="w-full">
                        <label
                          htmlFor="user"
                          className="block mb-2 text-sm font-semibold text-gray-700"
                        >
                          Last Maintenance
                        </label>
                        <input
                          id="lastMaintenance"
                          type="date"
                          className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                          value={formData.lastMaintenance}
                          onChange={handleChange}
                          required
                        />
                      </div>
                  </div>
                  <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                      <div className="w-full ">
                        <label
                          htmlFor="history"
                          className="block mb-2 text-sm font-semibold text-gray-700"
                        >
                          History
                        </label>
                        <textarea
                          id="history"
                          className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                          value={formData.history}
                          onChange={handleChange}
                          required
                          rows={5}
                        />
                      </div>
                      
                    </div>
                </div>
                <footer className="flex justify-end flex-shrink-0 p-4 space-x-4 bg-gray-100 rounded-b-xl">
                  <button
                    onClick={handleSave}
                    className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto"
                  >
                    Save
                  </button>
      
                  <button
                    onClick={closeAddModal}
                    className="w-full px-5 py-2 text-sm font-medium text-gray-700 transition duration-200 transform bg-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 md:w-auto"
                  >
                    Cancel
                  </button>
                </footer>
                </div>
              )}
       
              {activeTab === "ឯកសារយោង" && (
                <div className="px-6 py-6 space-y-6">
                {/* Flexbox container for form fields */}
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  {/* File input field */}
                  <div className="w-full md:w-1/2">
                    <label
                      htmlFor="lastMaintenance"
                      className="block mb-2 text-sm font-semibold text-gray-700"
                    >
                      ឯកសារយោង
                    </label>
                    <input
                      type="file"
                      id="file"
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="block w-full text-sm border border-gray-300 rounded-lg shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 disabled:opacity-50 disabled:pointer-events-none text-neutral-400 file:border-0 file:me-4 file:py-3 file:px-4 file:bg-blue-600 file:text-white"
                    />

                    {selectedFiles && selectedFiles.length > 0 && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected file: {selectedFiles[0].name}
                      </p>
                    )}

                  </div>
        
                  {/* Text input field */}
                  <div className="w-full md:w-1/2">
                    <label
                      htmlFor="activeDate"
                      className="block mb-2 text-sm font-semibold text-gray-700"
                    >
                    maintenanceId
                    </label>
                    <Select
                      options={optionMaintenanceId}
                      onChange={handlemaintenanceId}
                      placeholder="Select Company Code"
                      value={optionMaintenanceId.find(
                        (option) => option.value === formData.maintenanceId // Ensure correct mapping
                      )}
                      isClearable
                      className="basic-single"
                      classNamePrefix="select"
                      styles={customStyles}
                    />

                  </div>
                </div>
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  {/* File input field */}
                  
        
                  {/* Text input field */}
                  <div className="w-full">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-semibold text-gray-700"
                    >
                      បរិយាយ
                    </label>
                    <textarea
                      id="description"
                      type="text" 
                      onChange={handleChange}
                      value={formData.description}
                      className="block w-full py-3 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 text-center"
                      required
                    />
                  </div>
                </div>
                <button
                  onClick={handleFileUpload}
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Upload File
                </button>
              </div>
              )}
            </div>
          </div>
      )}


      {isEditModalOpen &&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative mx-auto transition-all transform bg-white shadow-2xl rounded-xl h-[550px] overflow-y-auto w-[1000px] overflow-y-auto" data-aos="zoom-in">
          <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
              <h2 className="text-xl font-bold text-white md:text-2xl">
                បន្ថែមថ្មី
              </h2>
              <button
                onClick={closeEditModal}
                className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl"
              >
                &times;
              </button>
            </header>

            <div className="w-full p-4">
              <div className="flex space-x-4 border-b">
                <button
                  className={`p-2 ${
                    activeTab === "បន្ថែម"
                      ? "border-b-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setActiveTab("បន្ថែម")}
                >
                  បន្ថែម
                </button>
                <button
                  className={`p-2 ${
                    activeTab === "ឯកសារយោង"
                      ? "border-b-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setActiveTab("ឯកសារយោង")}
                >
                  ឯកសារយោង
                </button>
              </div>
            </div>

            <div>
              {activeTab === "បន្ថែម" && (
                <div>
                   <div className="px-6 py-6 space-y-6">
                  <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                    <div className="w-full md:w-1/2">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Select Sub Category</label>
                      <Select
                          options={optionSubCate}
                          onChange={handleSubCate}
                          placeholder="Select Sub Category ID"
                          value={optionSubCate.find(
                            (option) => option.value === formData.subCategoryId
                          )}
                          isClearable
                          className="basic-single"
                          classNamePrefix="select"
                          styles={customStyles}
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Product ID</label>
                      <Select
                          options={optionProductID}
                          onChange={handleProductID}
                          placeholder="Select Company Code"
                          value={optionProductID.find(
                            (option) => option.value === formData.productId
                          )}
                          isClearable
                          className="basic-single"
                          classNamePrefix="select"
                          styles={customStyles}
                        />
                    </div>
                    
      
                  </div>
      
                  <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                      <div className="w-full md:w-1/2">
                        <label
                          htmlFor="technician"
                          className="block mb-2 text-sm font-semibold text-gray-700"
                        >
                          Technician
                        </label>
                        <Select
                          options={optionTechnician}
                          onChange={handleTechnician}
                          placeholder="Select Company Code"
                          value={optionTechnician.find(
                            (option) => option.value === formData.technician
                          )}
                          isClearable
                          className="basic-single"
                          classNamePrefix="select"
                          styles={customStyles}
                        />
                      </div>
      
                      <div className="w-full md:w-1/2">
                        <label
                          htmlFor="user"
                          className="block mb-2 text-sm font-semibold text-gray-700"
                        >
                          User
                        </label>
                        <input
                          id="users"
                          className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                          value={formData.users}
                          onChange={handleChange}
                          required
                        />
                      </div>
      
                  </div>
                  <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  <div className="w-full">
                        <label
                          htmlFor="user"
                          className="block mb-2 text-sm font-semibold text-gray-700"
                        >
                          Last Maintenance
                        </label>
                        <input
                          id="lastMaintenance"
                          type="date"
                          className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                          value={formData.lastMaintenance}
                          onChange={handleChange}
                          required
                        />
                      </div>
                  </div>
                  <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                      <div className="w-full ">
                        <label
                          htmlFor="history"
                          className="block mb-2 text-sm font-semibold text-gray-700"
                        >
                          History
                        </label>
                        <textarea
                          id="history"
                          className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                          value={formData.history}
                          onChange={handleChange}
                          required
                          rows={5}
                        />
                      </div>
                      
                    </div>
                </div>
            <footer className="flex justify-end flex-shrink-0 p-4 space-x-4 bg-gray-100 rounded-b-xl">
                    <button
                      onClick={handleSaveEdit}
                      className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto"
                    >
                      Save
                    </button>

                    <button
                      onClick={closeEditModal}
                      className="w-full px-5 py-2 text-sm font-medium text-gray-700 transition duration-200 transform bg-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 md:w-auto"
                    >
                      Cancel
                    </button>
                  </footer>
                </div>
              )}

              {activeTab === "ឯកសារយោង" && (
                <div>
                <div className="px-6 py-6 space-y-6">
                  {/* Flexbox container for form fields */}
                  <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                    {/* File input field */}
                    <div className="w-full md:w-1/2">
                      <label
                        htmlFor="lastMaintenance"
                        className="block mb-2 text-sm font-semibold text-gray-700"
                      >
                        ឯកសារយោង
                      </label>
                      <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="block w-full text-sm border border-gray-300 rounded-lg shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 disabled:opacity-50 disabled:pointer-events-none text-neutral-400 file:border-0 file:me-4 file:py-3 file:px-4 file:bg-blue-600 file:text-white"
                      />

                      {selectedFiles && selectedFiles.length > 0 && (
                        <p className="mt-2 text-sm text-gray-600">
                          Selected file: {selectedFiles[0].name}
                        </p>
                      )}

                    </div>
          
                    {/* Text input field */}
                    <div className="w-full md:w-1/2">
                      <label
                        htmlFor="activeDate"
                        className="block mb-2 text-sm font-semibold text-gray-700"
                      >
                      maintenanceId
                      </label>
                      <Select
                        options={optionMaintenanceId}
                        onChange={handlemaintenanceId}
                        placeholder="Select Company Code"
                        value={optionMaintenanceId.find(
                          (option) => option.value === formData.maintenanceId // Ensure correct mapping
                        )}
                        isClearable
                        className="basic-single"
                        classNamePrefix="select"
                        styles={customStyles}
                      />

                    </div>
                  </div>
                  <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                    {/* File input field */}
                    
          
                    {/* Text input field */}
                    <div className="w-full">
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-semibold text-gray-700"
                      >
                        បរិយាយ
                      </label>
                      <textarea
                        id="description"
                        type="text" 
                        onChange={handleChange}
                        value={formData.description}
                        className="block w-full py-3 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 text-center"
                        required
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleFileUpload}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    Upload File
                  </button>
                </div>
                
              </div>
              )}
              
            </div>
            
            
          </div>
        </div>
      )}
      

    </div>
  );
};

export default MaintenancePage;
