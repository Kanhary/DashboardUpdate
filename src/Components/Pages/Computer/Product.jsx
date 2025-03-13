import React, { useState, useEffect } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Select from "react-select";
import { IoMdRefresh } from "react-icons/io";
import Swal from "sweetalert2";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import {
  GetProduct,
  GetCategory,
  GetSubCategory,
  AddProduct,
  GetUserLogin,
  UpdateProduct,
  DeleteProduct,
  GetAllStaff,
  GetDep,
  GetFile,
  AddNewMaintenance,
  GetMaintenance,
} from "../../../api/user";


const Product = () => {
  const INITAIL_FORM_DATA = {
    productCode: "",
    deviceName: "",
    staffCode: "",
    departCode: "",
    categoryCode: "",
    modelName: "",
    brand: "",
    ramSize: "",
    storageSize: "",
    storageType: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyExpiration: "",
    location: "",
    unitOrSet: "",
    price: "",
    ipaddress: "",
    macAddress: "",
    note: "",
    supply: ""
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITAIL_FORM_DATA);
  const [editingComputer, setEditingComputer] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [Computers, setComputer] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategory] = useState([]);
  const [SubCategories, setSubCategory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [Staffs, setStaff] = useState([]);
  const [department, setDepartment] = useState([]);
  const [selectMaintenance, setMaintenance] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectComputer, setSelectComputer] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [maintenanceData, setMaintenaceData] = useState({});
  const [maintenanceId, setMaintenanceId] = useState({});
  const [selectedComputer, setSelectedComputer] = useState(null);
  

  // const DepList = [
  //   { CompanyCode: 'PPAP', DepartmentCode: 'Dep-admin', Department: 'នាយកដ្ឋាន រដ្ឋបាល',  BranchCode: 'TS3' },
  //   { CompanyCode: 'PPAP', DepartmentCode: 'Dep-HR', Department: 'នាយកដ្ឋាន បុគ្គលិក/ធនធានមនុស្ស',  BranchCode: 'TS3' },

  // ];
  const fetchComputer = async () => {
    try {
      const response = await GetProduct();
      console.log(response.data.data);
      setComputer(response.data.data);
    } catch (err) {
      setError({ message: err.message || "An error occurred" });
    }
  };
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await GetCategory();
        console.log(response.data.data);
        setCategory(response.data.data);
      } catch (err) {
        setError({ message: err.message || "An error occurred" });
      }
    };
    const fetchSubCategory = async () => {
      try {
        const response = await GetSubCategory();
        console.log(response.data.data);
        setSubCategory(response.data.data);
      } catch (err) {
        setError({ message: err.message || "An error occurred" });
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

    const fetchAllStaff = async () => {
      try {
        const response = await GetAllStaff();
        console.log("Get Staff code :", response.data.data);
        setStaff(response.data.data);
      } catch (err) {
        setError({ message: err.message || "An error occurred" });
      }
    };

    const fetchAllDep = async () => {
      try {
        const response = await GetDep();
        console.log(response.data.data);
        setDepartment(response.data.data);
      } catch (err) {
        setError({ message: err.message || "An error occurred" });
      }
    };

    const fetchMaintenace = async () => {
        try {
          const response = await GetMaintenance();
          console.log("Get maintenance :", response.data.data);
          setMaintenanceId(response.data.data);
        } catch (err) {
          setError({ message: err.message || "An error occurred" });
        }
    };


    
    fetchAllStaff();
    fetchSubCategory();
    fetchCategory();
    fetchComputer();
    fetchAllDep()
    fetchCurrentUser();
    fetchMaintenace();
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
  const filteredComputer = Computers.filter(
    (computer) =>
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
  const currentComputer = filteredComputer.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const getPaginationItems = () => {
    let pages = [];
    if (totalPages <= 7) {
      pages = [...Array(totalPages)].map((_, index) => index + 1);
    } else {
      if (currentPage < 4) {
        pages = [1, 2, 3, 4, "...", totalPages];
      } else if (currentPage > totalPages - 3) {
        pages = [
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
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
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveNew = () => {
    console.log("Save & New clicked", formData);
    setFormData(INITAIL_FORM_DATA);
  };

  const handleSave = async () => {
    // Prepare the data for submission
    const updatedFormData = {
      ...formData,
      categoryCode: formData.categoryCode || "",
      createdby: currentUser,
      lastBy: currentUser,
      lastdate: new Date().toISOString(),
      createdDate:new Date().toISOString(),
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

      console.log("API Response:", response);
      closeAddModal(); // Close the modal on successful save
      fetchComputer();
    } catch (error) {
      console.error("Error saving data", error);

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
      console.log("Saving product data:", formData);
      const id = formData.id; // Ensure this is valid
      if (!id) {
        Swal.fire({
          title: "Error",
          text: "product ID is missing",
          icon: "warning",
        });
        return;
      }

      const updatedFormData = {
        ...formData,
        lastby: currentUser,
        lastdate: new Date().toISOString(),
      }

      const response = await UpdateProduct(id, updatedFormData);

      if (response.status === 200) {
        console.log("product updated successfully:", response.data);
        Swal.fire({
          title: "Successful",
          text: "product updated successfully",
          icon: "success",
        });
        setIsEditModalOpen(false); // Close the edit modal
        fetchComputer();
      } else {
        const errorMessage =
          response.data.message || "An unexpected error occurred.";
        Swal.fire({
          title: "Error",
          text: "Error: " + errorMessage,
          icon: "warning",
        });
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        Swal.fire({
          title: "Error",
          text: error.response.data.message || "An unexpected error occurred.",
          icon: "error",
        });
      } else if (error.request) {
        console.error("Error request:", error.request);
        Swal.fire({
          title: "Error",
          text: "No response received from the server.",
          icon: "error",
        });
      } else {
        console.error("Error message:", error.message);
        Swal.fire({
          title: "Error",
          text: "An error occurred while setting up the request.",
          icon: "error",
        });
      }
    }
  };

  const deleteProduct = async (id) => {
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
        // Ensure currentUser is available before sending the request
        if (!currentUser) {
          Swal.fire({
            title: "Error!",
            text: "User not logged in. Unable to delete product.",
            icon: "error",
            confirmButtonText: "Okay",
          });
          return;
        }
  
        // Call DeleteProduct function with id and deleteby
        const response = await DeleteProduct(id, currentUser);
  
        if (response.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Product has been deleted.",
            icon: "success",
            confirmButtonText: "Okay",
          });
  
          // Update state to remove deleted product
          const updatedProduct = Computers.filter(
            (computer) => computer.id !== id
          );
          setComputer(updatedProduct);
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the product.",
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
        text: error.response?.data?.message || "Failed to connect to the server.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };
  
  

  const handleRAMSizeChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      ramSize: selectedOption ? selectedOption.value : "",
    }));
  };
  const handleStatusChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      status: selectedOption ? selectedOption.value : "",
    }));
  };
  
  const handleCompanyCodeChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      CompanyCode: selectedOption ? selectedOption.value : "",
    }));
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
  const optionsRamSize = [
    { value: "4", label: "4G" },
    { value: "8", label: "8G" },
    { value: "16", label: "16G" },
    { value: "32", label: "32G" },
    { value: "64", label: "64G" },
  ];

  const optionsStatus = [
    { value: "Active", label: "Active" },
    { value: "In Maintenance", label: "In Maintenance" },
    { value: "Retired", label: "Retired" },
    
  ];
  
  const handleUnitOrSet = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      unitOrSet: selectedOption ? selectedOption.value : "",
    }));
  };
  const optionUnitOrSet = [
    { value: "unit", label: "Unit" },
    { value: "set", label: "Set" },
  ];
  // const optionsBranch = branch.map(branch => ({
  //   value: branch.BranchCode,
  //   label: `${branch.BranchCode} - ${branch.BranchName}`
  // }));

  const optionsCategoryId = categories.map((category) => ({
    value: category.categoryCode,
    label: `${category.categoryCode}-${category.categoryName}`,
  }));

  const optionsSubCategoryId = SubCategories.map((subCategory) => ({
    value: subCategory.id,
    label: `${subCategory.subCategoryCode}-${subCategory.subCategoryName}`,
  }));

  const handleSubCategoryId = (option) => {
    console.log("Selected option:", option); // Check if selectedOption has the correct value
    setSelectedOption(option);
    setFormData((prevData) => ({
      ...prevData,
      subCategoryId: option ? option.value : "",
    }));
  };

  const handleCategoryId = (option) => {
    console.log("Selected option:", option); 
    setSelectedOption(option);
    setFormData((prevData) => ({
      ...prevData,
      categoryCode: option ? option.value : "",
    }));
  };

  const handleStaffCode = (option) => {
    console.log("Selected option:", option); // Check if selectedOption has the correct value
    setSelectedOption(option);
    setFormData((prevData) => ({
      ...prevData,
      staffCode: option ? option.value : "",
    }));
  };

  const handleDepartmentChange = (selectedOption) => {
    console.log("Selected department option:", selectedOption);

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        departCode: selectedOption ? selectedOption.value : "",
      };
      console.log("Updated formData:", updatedData); // Check if the updated data is correct
      return updatedData;
    });
  };

  const optionsStaffCode = (Staffs || []).map((staff) => ({
    value: staff.staffCode,
    label: `${staff.staffCode}-${staff.khName}`,
  }));

  const optionsDepartment = department.map((dep) => ({
    value: dep.departCode,
    label: `${dep.departCode} - ${dep.departEngName}`,
  }));

  const handleRefresh = () => {
    window.location.reload();
  };


  // const handleRightClick = (event, computer) => {
  //   console.log("Right-click triggered for ID:", computer.id); // Log the computer object
    

  //   // console.log("Right click triggered for maintenance ID :", maintenanceData.id);
  //   event.preventDefault();
  //   setContextMenu({
  //     visible: true,
  //     x: event.clientX, 
  //     y: event.clientY,
  //   });
  //   setSelectComputer(computer); // Ensure the full computer object is passed here
  //   setMaintenanceId(computer);
  // };
  
  


  // const handleMenuClick = (modalType, computer) => {
  //   console.log('Right-click triggered for computer ID:', computer.id); // Log the computer object
  //   setActiveModal(modalType);
  //   setSelectComputer(computer);  // Pass the full computer object to the modal
  //   setContextMenu(null);  // Close the context menu after the click
  // };
  
  
  
  

  const closeModal = () => {
    setActiveModal(null);
    setSelectComputer(null);
  }

  const closeMaintenanceModal = () => {
    setActiveModal(null);
    setSelectComputer(null);
  }


  return (
    <section className="mt-10 font-khmer">
      <h1 className="text-xl font-medium text-blue-800">តារាងកុំព្យូទ័រ</h1>
      <div className="mt-3 border"></div>
      <div className="w-full mt-4" data-aos="fade-up">
        <div className="relative w-full overflow-hidden bg-white shadow-md sm:rounded-lg">
          <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4  4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="ស្វែងរក"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required=""
                  />
                </div>
              </form>
            </div>
            <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
              <button
                onClick={handleRefresh}
                className="flex items-center justify-center px-5 py-2 text-lg font-medium text-white transition-transform transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 hover:scale-105 active:scale-95"
              >
                <IoMdRefresh />
                Refresh
              </button>
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

          <div className="w-full overflow-x-auto" data-aos="fade-right">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 border">
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 w-full h-full px-4 py-3 bg-white border-r"
                  >
                    Action
                  </th>
                  <th className="px-4 py-3 border-r">
                    Details
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "180px" }}
                  >
                    Product Code
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "180px" }}
                  >
                    Device Name
                  </th>
                  
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "250px" }}
                  >
                    Staff Code
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Model
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Brand
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Processor
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    RAM Size
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Storage Size
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Storage Type
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Serial Number
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Purchase Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Warranty EXP
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Location
                  </th>
                  {/* <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Quantity
                  </th> */}
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Unit Or Set
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    IP Address
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    MAC Address
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Note
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Supplier
                  </th>
                 
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Last By
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Last Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentComputer.map((computer, index) => (
                  <tr
                    key={computer.id}
                    onContextMenu={(e) => handleRightClick(e, computer)}
                    className="transition-colors duration-200 border border-b-gray-200 hover:bg-indigo-50"
                  >
                    <td className="sticky left-0 w-full h-full px-4 py-3 bg-white border-r">
                      <div className="flex items-center justify-center space-x-3">
                        <input
                          type="checkbox"
                          className="mr-1 action-checkbox"
                        />
                        <FaPen
                          className="ml-2 text-blue-500 cursor-pointer hover:text-blue-700"
                          onClick={() => openEditModal(computer)}
                        />
                        <FaTrashAlt
                          className="ml-2 text-red-500 cursor-pointer hover:text-red-700"
                          onClick={() => deleteProduct(computer.id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r">
                      <button
                        className="px-3 py-1 text-blue-500 transition hover:text-blue-600"
                        onClick={() => setSelectedComputer(computer)}
                      >
                        Details
                      </button>
                    </td>
                    <td className="px-4 py-4 border-r">{computer.productCode}</td>
                    <td className="px-4 py-4 border-r">{computer.deviceName}</td>
                    <td className="px-4 py-4 border-r">{computer.staffCode}</td>
                    <td className="px-4 py-4 border-r">{computer.departCode}</td>
                    <td className="px-4 py-4 border-r">{computer.categoryCode}</td>
                    <td className="px-4 py-4 border-r">{computer.modelName}</td>
                    <td className="px-4 py-4 border-r">{computer.brand}</td>
                    <td className="px-4 py-4 border-r">{computer.processor}</td>
                    <td className="px-4 py-4 border-r">{computer.ramSize}</td>
                    <td className="px-4 py-4 border-r">{computer.storageSize}</td>
                    <td className="px-4 py-4 border-r">{computer.storageType }</td>
                    <td className="px-4 py-4 border-r">{computer.serialNumber}</td>
                    <td className="px-4 py-4 border-r">{computer.purchaseDate}</td>
                    <td className="px-4 py-4 border-r">{computer.warrantyExpiration}</td>
                    <td className="px-4 py-4 border-r">{computer.location}</td>
                    {/* <td className="px-4 py-4 border-r">{computer.storageSize}</td> */}
                    <td className="px-4 py-4 border-r">{computer.unitOrSet}</td>
                    <td className="px-4 py-4 border-r">{computer.price}</td>
                    <td className="px-4 py-4 border-r">{computer.ipaddress}</td>
                    <td className="px-4 py-4 border-r">{computer.macAddress}</td>
                    <td className="px-4 py-4 border-r">{computer.status}</td>
                    <td className="px-4 py-4 border-r">{computer.note}</td>
                    <td className="px-4 py-4 border-r">{computer.supply}</td>
                    
                    <td className="px-4 py-4 border-r">{computer.lastBy}</td>
                    <td className="px-4 py-4 border-r">{computer.lastDate}</td>
                    
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
                    className={`flex items-center justify-center py-2 px-3 text-gray-500 bg-gradient-to-r from-gray-200 to-gray-300 border rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 14.707a1 1 0 01-1.414 0L6.586 10.414a1 1 0 010-1.414l4.293-4.293a1 1 0 011.414 1.414L8.414 10l3.879 3.879a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
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
                        className={`flex items-center justify-center py-2 px-3 border rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg"
                            : "text-gray-500 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400"
                        }`}
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
                    className={`flex items-center justify-center py-2 px-3 text-gray-500 bg-gradient-to-r from-gray-200 to-gray-300 border rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.707 14.707a1 1 0 010-1.414L11.586 10 7.707 6.121a1 1 0 111.414-1.414l4.293 4.293a1 1 010 1.414l-4.293 4.293a1 1 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>


      {selectedComputer && (
        <ViewDetailsModal
          computer={selectedComputer}
          closeModal={() => setSelectedComputer(null)}
        />
      )}


      {/* Add Office Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div
            className="relative mx-auto transition-all transform bg-white shadow-2xl rounded-xl h-[600px] overflow-y-auto w-[1000px]"
            data-aos="zoom-in"
          >
            <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl ">
              <h2 className="text-xl font-bold text-white md:text-2xl">
                បន្ថែមកុំព្យូទ័រថ្មី
              </h2>
              <button
                onClick={closeAddModal}
                className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl"
              >
                &times;
              </button>
            </header>
            <div className="px-6 py-6 space-y-6">
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="productCode"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Product Code
                  </label>
                  <input
                    id="productCode"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.productCode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="engName"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Device Name
                  </label>
                  <input
                    id="deviceName"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.deviceName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
              <div className="w-full md:w-1/2">
                  <label
                    htmlFor="staffcode"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Staff Code
                  </label>
                  <Select
                    options={optionsStaffCode}
                    onChange={handleStaffCode} // Ensure handleStaffCode is passed correctly here
                    value={optionsStaffCode.find(
                      (option) => option.value === formData.staffCode
                    )}
                    placeholder="Select or type to search"
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="CompanyCode"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Department
                  </label>
                  <Select
                  options={optionsDepartment}
                  onChange={handleDepartmentChange}
                  placeholder="Select Department"
                  value={optionsDepartment.find(
                    (option) => option.value === formData.departCode
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
                    htmlFor="brand"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Brand Name
                  </label>
                  <input
                    id="brand"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="modelName"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Model
                  </label>
                  <input
                    id="modelName"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.modelName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="staffcode"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    RAM size
                  </label>
                  <Select
                    options={optionsRamSize}
                    onChange={handleRAMSizeChange} // Ensure handleStaffCode is passed correctly here
                    value={optionsRamSize.find(
                      (option) => option.value === formData.ramSize
                    )}
                    placeholder="Select or type to search"
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="processor"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Processor
                  </label>
                  <input
                    id="processor"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.processor }
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="storageSize"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Storage Size
                  </label>
                  <input
                    id="storageSize"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.storageSize}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="storageType"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Storage Type
                  </label>
                  <input
                    id="storageType"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.storageType}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="serialNumber"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Serial Number
                  </label>
                  <input
                    id="serialNumber"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="engName"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Price
                  </label>
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
                  <label
                    htmlFor="warrantyExpiration"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Warranty Expiration
                  </label>
                  <input
                    id="warrantyExpiration"
                    type="date"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.warrantyExpiration}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="purchaseDate"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    id="purchaseDate"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                  />
                </div>
              </div>


              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="ipaddress"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    IP Address
                  </label>
                  <input
                    id="ipaddress"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.ipaddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="engName"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Mac Address
                  </label>
                  <input
                    id="macAddress"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.macAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
              <div className="w-full md:w-1/2">
                  <label
                    htmlFor="categoryCode"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Category Code
                  </label>
                  <Select
                    options={optionsCategoryId}
                    onChange={handleCategoryId}
                    placeholder="Select Company Code"
                    value={optionsCategoryId.find(
                      (option) => option.value === formData.categoryCode
                    )}
                    isClearable
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="unitOrSet"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Unit or Set
                  </label>
                  <Select
                    options={optionUnitOrSet}
                    onChange={handleUnitOrSet}
                    placeholder="Select Company Code"
                    value={optionUnitOrSet.find(
                      (option) => option.value === formData.unitOrSet
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
                    htmlFor="quantity"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="supply"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Supplier
                  </label>
                  <input
                    id="supply"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.supply}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="note"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Note
                  </label>
                  <input
                    id="note"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.note}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="status"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Status
                  </label>
                  <Select
                    options={optionsStatus}
                    onChange={handleStatusChange}
                    placeholder="Select computer status"
                    value={optionsStatus.find(
                      (option) => option.value === formData.status
                    )}
                    isClearable
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
              <div className="w-full">
                  <label
                    htmlFor="location"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
            </div>
            <footer className="flex flex-col-reverse items-center justify-end px-6 py-4 space-y-3 space-y-reverse bg-gray-100 rounded-b-xl md:flex-row md:space-x-3 md:space-y-0">
              <button
                onClick={handleSaveNew}
                className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto"
              >
                Save & New
              </button>
              <button
                onClick={handleSave}
                className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-green-500 to-green-700 hover:shadow-lg hover:scale-105 md:w-auto"
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
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div
            className="relative mx-auto transition-all transform bg-white shadow-2xl rounded-xl h-[600px] overflow-y-auto w-[1000px]"
            data-aos="zoom-in"
          >
            <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
              <h2 className="text-xl font-bold text-white md:text-2xl">
                កែប្រែព័ត៌មានកុំព្យូទ័រ
              </h2>
              <button
                onClick={closeEditModal}
                className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl"
              >
                &times;
              </button>
            </header>
            <div className="px-6 py-6 space-y-6">
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="productCode"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Product Code
                  </label>
                  <input
                    id="productCode"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.productCode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="engName"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Device Name
                  </label>
                  <input
                    id="deviceName"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.deviceName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
              <div className="w-full md:w-1/2">
                  <label
                    htmlFor="staffcode"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Staff Code
                  </label>
                  <Select
                    options={optionsStaffCode}
                    onChange={handleStaffCode} // Ensure handleStaffCode is passed correctly here
                    value={optionsStaffCode.find(
                      (option) => option.value === formData.staffCode
                    )}
                    placeholder="Select or type to search"
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="CompanyCode"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Department
                  </label>
                  <Select
                  options={optionsDepartment}
                  onChange={handleDepartmentChange}
                  placeholder="Select Department"
                  value={optionsDepartment.find(
                    (option) => option.value === formData.departCode
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
                    htmlFor="brand"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Brand Name
                  </label>
                  <input
                    id="brand"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="modelName"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Model
                  </label>
                  <input
                    id="modelName"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.modelName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="staffcode"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    RAM size
                  </label>
                  <Select
                    options={optionsRamSize}
                    onChange={handleRAMSizeChange} 
                    value={optionsRamSize.find(
                      (option) => option.value === formData.ramSize
                    )}
                    placeholder="Select or type to search"
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="processor"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Processor
                  </label>
                  <input
                    id="processor"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.processor }
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="storageSize"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Storage Size
                  </label>
                  <input
                    id="storageSize"
                    className="block w-full px-4 py-2 text-sm text-gray-
                    border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.storageSize}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="storageType"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Storage Type
                  </label>
                  <input
                    id="storageType"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.storageType}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="serialNumber"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Serial Number
                  </label>
                  <input
                    id="serialNumber"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="engName"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Price
                  </label>
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
                  <label
                    htmlFor="warrantyExpiration"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Warranty Expiration
                  </label>
                  <input
                    id="warrantyExpiration"
                    type="date"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.warrantyExpiration}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="purchaseDate"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    id="purchaseDate"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                  />
                </div>
              </div>


              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="ipaddress"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    IP Address
                  </label>
                  <input
                    id="ipaddress"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.ipaddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="engName"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Mac Address
                  </label>
                  <input
                    id="macAddress"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.macAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
              <div className="w-full md:w-1/2">
                  <label
                    htmlFor="categoryCode"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Category Code
                  </label>
                  <Select
                    options={optionsCategoryId}
                    onChange={handleCategoryId}
                    placeholder="Select Company Code"
                    value={optionsCategoryId.find(
                      (option) => option.value === formData.categoryCode
                    )}
                    isClearable
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="unitOrSet"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Unit or Set
                  </label>
                  <Select
                    options={optionUnitOrSet}
                    onChange={handleUnitOrSet}
                    placeholder="Select Company Code"
                    value={optionUnitOrSet.find(
                      (option) => option.value === formData.unitOrSet
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
                    htmlFor="quantity"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="supply"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Supplier
                  </label>
                  <input
                    id="supply"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.supply}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="note"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Note
                  </label>
                  <input
                    id="note"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.note}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="status"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Status
                  </label>
                  <Select
                    options={optionsStatus}
                    onChange={handleStatusChange}
                    placeholder="Select computer status"
                    value={optionsStatus.find(
                      (option) => option.value === formData.status
                    )}
                    isClearable
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
              <div className="w-full">
                  <label
                    htmlFor="location"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
            </div>
            <footer className="flex flex-col-reverse items-center justify-end px-6 py-4 space-y-3 space-y-reverse bg-gray-100 rounded-b-xl md:flex-row md:space-x-3 md:space-y-0">
              <button
                onClick={handleUpdate}
                className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-green-500 to-green-700 hover:shadow-lg hover:scale-105 md:w-auto"
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
        </div>
      )}

      {/* {selectMaintenance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                  <div className="relative mx-auto transition-all transform bg-white shadow-2xl rounded-xl h-[500px] overflow-y-auto w-[700px]">
                    <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
                      <h2 className="text-xl font-bold text-white md:text-2xl">
                        Details
                      </h2>
                      <button
                        // onClick={closeAddModal}
                        className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl"
                      >
                        &times;
                      </button>
                    </header>

                  </div>
                </div>
      )} */}

{contextMenu && (
  <div
    className="absolute bg-white shadow-lg rounded-md border z-50"
    style={{ top: contextMenu.y, left: contextMenu.x }}
  >
    <ul className="p-2 space-y-1 text-gray-700">
      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={() => handleMenuClick("addMaintenance", selectComputer)} // Pass the entire computer object
      >
        Add Maintenance
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={() => handleMenuClick("modifyMaintenance", selectComputer)} // Pass the entire computer object
      >
        Modify Maintenance
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
        onClick={() => handleMenuClick("viewDetails", selectComputer)} // Pass the entire computer object
      >
        View Details
      </li>
    </ul>
  </div>
)}


      {/* Modals */}
      {activeModal === "addMaintenance" && selectComputer && (
      <AddMaintenanceModal computer={selectComputer} closeModal={closeModal} />
    )}
    {activeModal === "modifyMaintenance" && selectComputer && (
      <ModifyMaintenanceModal computer={selectComputer} closeModal={closeModal} />
    )}
    {activeModal === 'viewDetails' && selectComputer && (
      <ViewDetailsModal
        computer={selectComputer}
        closeModal={() => setActiveModal(null)} // Function to close the modal
      />
    )}

    </section>
  );
};

// const AddMaintenanceModal = ({ computer, closeModal }) => {
//   const [activeTab, setActiveTab] = useState("Add Maintenance");
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [formData, setFormDa
// ta] = useState({
//     productCode: '',
//     lastMaintenance: new Date().toISOString().split("T")[0],
//     technician: '',
//     users: '',
//     history: '',
//     activeDate: new Date().toISOString().split("T")[0],
//     maintenanceId: computer?.id || '',
//     // subCategoryId: 
//     description: '',
//     subcategoryId : ''
//   });
//   const [subCate, setSubCate] = useState([]);


//   useEffect(() => {
//     const fetchSubCategory = async () => {
//       try {
//         const response = await GetSubCategory(); // Call the API to get the subcategories
//         console.log("Fetched subcategories:", response.data); // Check the actual structure of the response
//         setSubCate(response.data.data); // Set the subcategories array (assuming it contains the necessary data)
//       } catch (error) {
//         console.error("Error fetching subcategory:", error);
//       }
//     };

//     fetchSubCategory();
//   }, [])

//   const optionSubCate = subCate?.map((sub) => ({
//     value: sub.id,
//     label: `${sub.id} - ${sub.subCategoryCode}`,
//   })) || [];

//   const handleSubCate = (selectedOption) => {
//     setFormData({
//       ...formData,
//       subcategoryId: selectedOption ? selectedOption.value : "", // Update subcategoryId correctly
//     });
//   };
  

//   useEffect(() => {
//     setFormData((prev) => ({ ...prev, maintenanceId: computer?.id || '' }));
//   }, [computer]);

//   const handleFileChange = (event) => {
//     const files = Array.from(event.target.files);
//     setSelectedFiles(files.length > 0 ? files : []);
//   };

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleFileUpload = async () => {
//     if (!selectedFiles.length) {
//       Swal.fire({ title: "Error!", text: "Please select a valid file before uploading.", icon: "error" });
//       return;
//     }
    
//     if (!formData.maintenanceId) {
//       Swal.fire({ title: "Error!", text: "Invalid maintenance ID.", icon: "error" });
//       return;
//     }

//     const formDataToSend = new FormData();
//     formDataToSend.append("maintenanceId", formData.maintenanceId);
//     formDataToSend.append("file", selectedFiles[0]);
//     formDataToSend.append("description", formData.description);

//     try {
//       const response = await axios.post("http://192.168.100.55:8759/Docs/uploadFilePdf", formDataToSend, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.status === 200) {
//         Swal.fire({ title: "Success!", text: "File uploaded successfully.", icon: "success" });
//         setSelectedFiles([]);
//       } else {
//         throw new Error(`Upload failed: ${response.statusText}`);
//       }
//     } catch (error) {
//       Swal.fire({ title: "Error!", text: error.response?.data?.message || "Failed to upload file.", icon: "error" });
//     }
//   };


//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       background: "#fff",
//       borderColor: "#9e9e9e",
//       minHeight: "30px",
//       height: "37px",
//       boxShadow: state.isFocused ? null : null,
//     }),

//     valueContainer: (provided, state) => ({
//       ...provided,
//       height: "30px",
//       padding: "0 6px",
//     }),

//     input: (provided, state) => ({
//       ...provided,
//       margin: "0px",
//     }),
//     indicatorSeparator: (state) => ({
//       display: "none",
//     }),
//     indicatorsContainer: (provided, state) => ({
//       ...provided,
//       height: "30px",
//     }),
//   };

//   const handleSave = async () => {
//     // Prepare the data for submission
//     const updatedFormData = {
//       productId: computer.id,
//       subCategoryId: formData.subcategoryId,  // Assuming it's from Select component
//       users: formData.users,
//       technician: formData.technician,
//       lastMaintenance: formData.lastMaintenance,
//       history: formData.history
//     };
  
//     try {
//       // Call your API to save the data
//       const response = await AddNewMaintenance(updatedFormData);
  
//       // Show success alert
//       Swal.fire({
//         title: "Saved!",
//         text: "Maintenance has been saved successfully.",
//         icon: "success",
//         confirmButtonText: "Okay",
//       });
  
//       console.log("API Response:", response);
  
//       // Close modal and refresh maintenance data
//       closeModal();
//       fetchMaintenance(); // Assuming you have a function to fetch the latest maintenance data
//     } catch (error) {
//       console.error("Error saving data", error);
  
//       // Show error alert if something goes wrong
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to save maintenance.",
//         icon: "error",
//         confirmButtonText: "Okay",
//       });
//     }
//   };
  
  
  

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
//   <div className="relative mx-auto transition-all transform bg-white shadow-2xl rounded-xl w-[1000px] max-h-[1000px] flex flex-col">
//         <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
//           <h2 className="text-xl font-bold text-white md:text-2xl">Add Maintenance</h2>
//           <button onClick={closeModal} className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl">&times;</button>
//         </header>
//         <div className="w-full p-4">
//           <div className="flex space-x-4 border-b">
//             <button className={`p-2 ${activeTab === "Add Maintenance" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab("Add Maintenance")}>បន្ថែម</button>
//             <button className={`p-2 ${activeTab === "ឯកសារយោង" ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab("ឯកសារយោង")}>ឯកសារយោង</button>
//           </div>
//         </div>


//         {activeTab === "Add Maintenance" &&(
//           <div>
//             <div className="px-6 py-6 space-y-6">
//             <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
//               <div className="w-full md:w-1/2">
//               <label className="block mb-2 text-sm font-semibold text-gray-700">Select Staff</label>
//                 <Select
//                     options={optionSubCate}
//                     onChange={handleSubCate}
//                     placeholder="Select Company Code"
//                     value={optionSubCate.find(
//                       (option) => option.value === formData.subcategoryId
//                     )}
//                     isClearable
//                     className="basic-single"
//                     classNamePrefix="select"
//                     styles={customStyles}
//                   />
//               </div>

//               <div className="w-full md:w-1/2">
//                   <label
//                     htmlFor="user"
//                     className="block mb-2 text-sm font-semibold text-gray-700"
//                   >
//                     User
//                   </label>
//                   <input
//                     id="users"
//                     className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
//                     value={formData.users}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//             </div>

//             <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
//                 <div className="w-full md:w-1/2">
//                   <label
//                     htmlFor="technician"
//                     className="block mb-2 text-sm font-semibold text-gray-700"
//                   >
//                     Technician
//                   </label>
//                   <input
//                     id="technician"
//                     className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
//                     value={formData.technician}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//               <div className="w-full md:w-1/2">
//                   <label
//                     htmlFor="user"
//                     className="block mb-2 text-sm font-semibold text-gray-700"
//                   >
//                     Last Maintenance
//                   </label>
//                   <input
//                     id="lastMaintenance"
//                     type="date"
//                     className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
//                     value={formData.lastMaintenance}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//             </div>
//             <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
//                 <div className="w-full ">
//                   <label
//                     htmlFor="history"
//                     className="block mb-2 text-sm font-semibold text-gray-700"
//                   >
//                     History
//                   </label>
//                   <textarea
//                     id="history"
//                     className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
//                     value={formData.history}
//                     onChange={handleChange}
//                     required
//                     rows={5}
//                   />
//                 </div>
                
//               </div>
//           </div>
//           <footer className="flex justify-end flex-shrink-0 p-4 space-x-4 bg-gray-100 rounded-b-xl">
//             <button
//               onClick={handleSave}
//               className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto"
//             >
//               Save
//             </button>

//             <button
//               onClick={closeModal}
//               className="w-full px-5 py-2 text-sm font-medium text-gray-700 transition duration-200 transform bg-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 md:w-auto"
//             >
//               Cancel
//             </button>
//           </footer>
//           </div>
//         )}
 
//         {activeTab === "ឯកសារយោង" && (
//           <div className="px-6 py-6 space-y-6">
//             <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
//               <div className="w-full md:w-1/2">
//                 <label htmlFor="file" className="block mb-2 text-sm font-semibold text-gray-700">ឯកសារយោង</label>
//                 <input type="file" id="file" onChange={handleFileChange} accept=".pdf" className="block w-full text-sm border border-gray-300 rounded-lg shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 disabled:opacity-50 disabled:pointer-events-none text-neutral-400 file:border-0 file:me-4 file:py-3 file:px-4 file:bg-blue-600 file:text-white" />
//                 {selectedFiles.length > 0 && <p className="mt-2 text-sm text-gray-600">Selected file: {selectedFiles[0].name}</p>}
//               </div>
//               <div className="w-full md:w-1/2">
//                 <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-700">បរិយាយ</label>
//                 <input id="description" type="text" onChange={handleChange} value={formData.description} className="block w-full py-3 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 text-center" required />
//               </div>
//             </div>
//             <button onClick={handleFileUpload} className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Upload File</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


const ModifyMaintenanceModal = ({computer, closeModal}) =>{
  const [activeTab, setActiveTab] = useState("Modify Maintenance");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    productCode: '',
    lastMaintenance: new Date().toISOString().split("T")[0],
    technician: '',
    users: '',
    history: '',
    activeDate: new Date().toISOString().split("T")[0],
    maintenanceId: computer?.id || '',
    // subCategoryId: 
    description: '',
    subcategoryId : ''
  });
  const [subCate, setSubCate] = useState([]);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [Maintenance, setMaintenance] = useState([]);

  const openModifyModal = (selectedMaintenance) => {
    setFormData({
      subcategoryId: selectedMaintenance.subcategoryId || "",
      users: selectedMaintenance.users || "",
      technician: selectedMaintenance.technician || "",
      lastMaintenance: selectedMaintenance.lastMaintenance || "",
    });
    setIsModifyModalOpen(true);
  };


  const fetchMaintenace = async () => {
      try {
        const response = await GetMaintenance();
        console.log("Get Maintenance :", response.data.data);
        setFormData(response.data.data);
      } catch (err) {
        // setError({ message: err.message || "An error occurred" });
      }
    };

  useEffect(() => {
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
    fetchMaintenace();
  }, [])

  const optionSubCate = subCate?.map((sub) => ({
    value: sub.id,
    label: `${sub.id} - ${sub.subCategoryCode}`,
  })) || [];

  const handleSubCate = (selectedOption) => {
    setFormData({
      ...formData,
      subcategoryId: selectedOption ? selectedOption.value : "", // Update subcategoryId correctly
    });
  };
  

  useEffect(() => {
    setFormData((prev) => ({ ...prev, maintenanceId: computer?.id || '' }));
  }, [computer]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files.length > 0 ? files : []);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = async () => {
    if (!selectedFiles.length) {
      Swal.fire({ title: "Error!", text: "Please select a valid file before uploading.", icon: "error" });
      return;
    }
    
    if (!formData.maintenanceId) {
      Swal.fire({ title: "Error!", text: "Invalid maintenance ID.", icon: "error" });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("maintenanceId", formData.maintenanceId);
    formDataToSend.append("file", selectedFiles[0]);
    formDataToSend.append("description", formData.description);

    try {
      const response = await axios.post("http://192.168.100.55:8759/Docs/uploadFilePdf", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        Swal.fire({ title: "Success!", text: "File uploaded successfully.", icon: "success" });
        setSelectedFiles([]);
      } else {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      Swal.fire({ title: "Error!", text: error.response?.data?.message || "Failed to upload file.", icon: "error" });
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

  const handleSaveEdit = async () => {
    if (!formData.maintenanceId) {
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
      subcategoryId: formData.subcategoryId,
      users: formData.users,
      technician: formData.technician,
      lastMaintenance: formData.lastMaintenance,
      history: formData.history,
    };
  
    try {
      // Call your API to update the maintenance record
      const response = await fetch(
        `http://192.168.100.55:8759/Maintenance/updateMaintenanceById/${formData.maintenanceId}`,
        {
          method: "PUT", // Use PUT for updates
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update maintenance.");
      }
  
      const responseData = await response.json();
      console.log("API Response:", responseData);
  
      // Show success alert
      Swal.fire({
        title: "Updated!",
        text: "Maintenance record has been updated successfully.",
        icon: "success",
        confirmButtonText: "Okay",
      });
  
      closeModal(); // Close the modal on successful update
      fetchMaintenace(); // Refresh maintenance data
    } catch (error) {
      console.error("Error updating data:", error.message);
  
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to update maintenance.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };
  
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
  <div className="relative mx-auto transition-all transform bg-white shadow-2xl rounded-xl w-[1000px] max-h-[1000px] flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
          <h2 className="text-xl font-bold text-white md:text-2xl">Add Maintenance</h2>
          <button onClick={closeModal} className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl">&times;</button>
        </header>      
  <div>
    <div className="px-6 py-6 space-y-6">
      <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
        {/* Select Staff */}
        <div className="w-full md:w-1/2">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Select Staff</label>
          <Select
            options={optionSubCate}
            onChange={handleSubCate}
            placeholder="Select Subcategory"
            value={optionSubCate.find(
              (option) => option.value === formData.subcategoryId
            )}
            isClearable
            className="basic-single"
            classNamePrefix="select"
            styles={customStyles}
          />
        </div>

        {/* User */}
        <div className="w-full md:w-1/2">
          <label
            htmlFor="users"
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
        {/* Technician */}
        <div className="w-full md:w-1/2">
          <label
            htmlFor="technician"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Technician
          </label>
          <input
            id="technician"
            className="block w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
            value={formData.technician}
            onChange={handleChange}
            required
          />
        </div>

        {/* Last Maintenance Date */}
        <div className="w-full md:w-1/2">
          <label
            htmlFor="lastMaintenance"
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

      {/* History */}
      <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
        <div className="w-full">
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

    {/* Footer with buttons */}
    <footer className="flex justify-end flex-shrink-0 p-4 space-x-4 bg-gray-100 rounded-b-xl">
      <button
        onClick={handleSaveEdit} // This function handles updating the maintenance data
        className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto"
      >
        Update
      </button>

      <button
        onClick={closeModal}
        className="w-full px-5 py-2 text-sm font-medium text-gray-700 transition duration-200 transform bg-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 md:w-auto"
      >
        Cancel
      </button>
    </footer>
  </div>

      </div>
    </div>
  )
}

const ViewDetailsModal = ({ computer, closeModal }) => {
  const [activeTab, setActiveTab] = useState("details"); // Track active tab
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState("");
  const [subCate, setSubCate] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    productCode: '',
    lastMaintenance: new Date().toISOString().split("T")[0],
    technician: '',
    users: '',
    history: '',
    activeDate: new Date().toISOString().split("T")[0],
    maintenanceId: computer?.id || '',
    // subCategoryId: 
    description: '',
    subCategoryId : ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedId, setSelectId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // const openEditModal = (entry) => {
  //   setEditingMaintenance(entry);
  
  //   setFormData({
  //     ...entry,
  //     lastMaintenance: entry.lastMaintenance
  //       ? new Date(entry.lastMaintenance).toISOString().split("T")[0]
  //       : "",
  //     activeDate: entry.activeDate
  //       ? new Date(entry.activeDate).toISOString().split("T")[0]
  //       : "",
  //   });
  
  //   setIsEditModalOpen(true);
  // };


  const openEditModal = (entry, id) => {
    setSelectId(id);
    setEditingMaintenance(entry);
    setFormData(entry);
    setIsEditModalOpen(true);
  };
  const closeEditMaintenanceModal =(entry) =>{
    setEditingMaintenance(null);
    setFormData(entry);
    setIsEditModalOpen(false);
  }



  const handleEditClick = (entry) => {
    setSelectedMaintenance(entry); // Set selected maintenance data
    setIsEditModalOpen(true); 
    console.log("Id ")
  };


  useEffect(() => {
    const fetchMaintenanceDetails = async () => {
      if (!computer?.id) {
        console.error("Invalid computer object or ID");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://192.168.100.55:8759/Maintenance/getMaintenancesByProductId/${computer.id}`
        );

        if (response.data?.data) {
          setDetails(response.data.data);
        } else {
          setDetails(null);
        }
      } catch (error) {
        console.error("Error fetching maintenance details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSubCategory = async () => {
      try {
        const response = await GetSubCategory(); // Call the API to get the subcategories
        console.log("Fetched subcategories:", response.data); // Check the actual structure of the response
        setSubCate(response.data.data); // Set the subcategories array (assuming it contains the necessary data)
      } catch (error) {
        console.error("Error fetching subcategory:", error);
      }
    };

    fetchMaintenanceDetails();
    fetchSubCategory();
  }, [computer]);

  useEffect(() => {
    const fetchMaintenanceReport = async () => {
        if (!details || !details.id) return; // Safe check

        try {
            console.log("Fetching report for ID:", details.id);
            const response = await GetFile(details.id);
            console.log("Response Data:", response.data.data);

            setFiles(response.data.data || []);
        } catch (error) {
            console.error("Error fetching maintenance report:", error);
        } finally {
            setIsLoadingFiles(false);
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

    fetchMaintenanceReport();
    fetchCurrentUser();
}, [details]);

const optionSubCate = subCate?.map((sub) => ({
  value: sub.id,
  label: `${sub.id} - ${sub.subCategoryCode}`,
})) || [];

const handleSubCate = (selectedOption) => {
  setFormData({
    ...formData,
    subcategoryId: selectedOption ? selectedOption.value : "", // Update subcategoryId correctly
  });
};

const optionTechnician = [
  { value: "ICT", label: "ICT" },
];

const handleTechnician = (selectedOption) => {
  setFormData({
    ...formData,
    technician: selectedOption ? selectedOption.value : "", // Update subcategoryId correctly
  });
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

const handleChange = (e) => {
  const { id, value } = e.target;
  setFormData((prev) => ({ ...prev, [id]: value }));
};

const handleSave = async () => {
  // Prepare the data for submission
  const updatedFormData = {
    productId: computer.id,
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

const handleFileUpload = async () => {
  if (!selectedFiles.length) {
    Swal.fire({ title: "Error!", text: "Please select a valid file before uploading.", icon: "error" });
    return;
  }
  
  if (!formData.maintenanceId) {
    Swal.fire({ title: "Error!", text: "Invalid maintenance ID.", icon: "error" });
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("maintenanceId", formData.maintenanceId);
  formDataToSend.append("file", selectedFiles[0]);
  formDataToSend.append("description", formData.description);

  try {
    const response = await axios.post("http://192.168.100.55:8759/Docs/uploadFilePdf", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      Swal.fire({ title: "Success!", text: "File uploaded successfully.", icon: "success" });
      setSelectedFiles([]);
    } else {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  } catch (error) {
    Swal.fire({ title: "Error!", text: error.response?.data?.message || "Failed to upload file.", icon: "error" });
  }
};

const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  setSelectedFiles(files.length > 0 ? files : []);
};

console.log("Details:",details);


const handleSaveEdit = async () => {
  // if (!formData.maintenanceId) {
  //   Swal.fire({
  //     title: "Error!",
  //     text: "Maintenance ID is missing.",
  //     icon: "error",
  //     confirmButtonText: "Okay",
  //   });
  //   return;
  // }

  // Prepare the data for submission
  const updatedFormData = {
    ...formData,
    lastBy: currentUser,
    lastDate: new Date().toISOString(),
  };

  try {
    // Call your API to update the maintenance record
    const response = await fetch(
      `http://192.168.100.55:8759/Maintenance/updateMaintenanceById/${formData.id}`,
      {
        method: "POST", // Use PUT for updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update maintenance.");
    }

    const responseData = await response.json();
    console.log("API Response:", responseData);

    // Show success alert
    Swal.fire({
      title: "Updated!",
      text: "Maintenance record has been updated successfully.",
      icon: "success",
      confirmButtonText: "Okay",
    });

    closeModal(); // Close the modal on successful update
    // GetMaintenance(); // Refresh maintenance data
  } catch (error) {
    console.error("Error updating data:", error.message);

    // Show error alert
    Swal.fire({
      title: "Error!",
      text: error.message || "Failed to update maintenance.",
      icon: "error",
      confirmButtonText: "Okay",
    });
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative mx-auto transition-all transform bg-white shadow-2xl rounded-xl h-[550px] overflow-y-auto w-[1000px]" data-aos="zoom-in">
      <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
              <h2 className="text-xl font-bold text-white md:text-2xl">
                Maintenace View 
              </h2>
              <button
                onClick={closeModal}
                className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl"
              >
                &times;
              </button>
            </header>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "details" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Maintenance Details
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "report" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("report")}
          >
            Maintenance Report
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "add" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("add")}
          >
            Add
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
  <div className="px-6 space-y-8">
    {/* Maintenance History Header */}
    {/* <div className="flex justify-between items-center border-b pb-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Maintenance History for {computer.name}</h2>
      <button className="text-sm text-gray-500 hover:text-gray-700">
        [❌ Close]
      </button>
    </div> */}

    {/* Last Maintenance Section */}
    {/* <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-gray-700">Last Maintenance: <span className="font-semibold">{details?.[details.length - 1].lastMaintenance || "N/A"}</span></p>
      </div>

      <div className="flex items-center space-x-2">
        <p className="text-sm text-gray-700">Technician: <span className="font-semibold">{details?.[details.length - 1].technician || "N/A"}</span></p>
      </div>

      <div className="flex items-center space-x-2">
        <p className="text-sm text-gray-700">User: <span className="font-semibold">{details?.[details.length - 1].users || "N/A"}</span></p>
      </div>

      <div className="flex items-center space-x-2">
        <p className="text-sm text-gray-700">Created By: <span className="font-semibold">{details?.[details.length - 1].createdBy || "Admin"}</span></p>
      </div>

    </div> */}

    {/* Full Maintenance History Table */}
    <div className="mt-6">
      <p className="text-sm font-semibold text-gray-900">Full Maintenance History</p>
      <div className="overflow-x-auto mt-4 bg-white shadow-sm rounded-lg">
  <table className="min-w-full table-auto">
    <thead>
      <tr className="bg-gray-100 text-sm text-gray-700">
        <th className="py-3 px-6 text-left">Action</th>
        <th className="py-3 px-6 text-left">User</th>
        <th className="py-3 px-6 text-left">Notes</th>
        {/* <th className="py-3 px-6 text-left">Type</th> */}
        <th className="py-3 px-6 text-left">Technician</th>
        <th className="py-3 px-6 text-left">Last Maintenance</th>
      </tr>
    </thead>
    <tbody>
      {details?.length > 0 ? (
        details.map((entry) => (
          <tr key={entry.id} className="border-b hover:bg-gray-50">
            <td className="py-3 px-6 text-sm text-gray-800">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => openEditModal(entry, entry.id)}
              >
                <FaPen />
              </button>
            </td>
            <td className="py-3 px-6 text-sm text-gray-800">{entry.users || "N/A"}</td>
            <td className="py-3 px-6 text-sm text-gray-800">{entry.history || "No Notes"}</td>
            {/* <td className="py-3 px-6 text-sm text-gray-800">{entry.subCategoryId}</td> */}
            <td className="py-3 px-6 text-sm text-gray-800">{entry.technician || "N/A"}</td>
            <td className="py-3 px-6 text-sm text-gray-800">{entry.lastMaintenance}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" className="py-3 px-6 text-sm text-gray-800 text-center">
            No Maintenance Data Available
          </td>
        </tr>
      )}

    </tbody>
  </table>
</div>




    </div>

    {/* Last Updated Section */}
    {/* <div className="mt-6 flex items-center space-x-2">
      <p className="text-sm text-gray-700">Last Updated: <span className="font-semibold">{details?.lastDate || "N/A"}</span></p>
      <span className="text-sm text-gray-500">by {details?.updatedBy || "Admin"}</span>
    </div> */}

    {/* Action Buttons */}
    {/* <div className="mt-6 flex space-x-4">
      <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-300">
        [🔄 Refresh]
      </button>
      <button className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300">
        [❌ Close]
      </button>
    </div> */}
  </div>
)}

{isEditModalOpen && setEditingMaintenance && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="relative mx-auto transition-all transform bg-white shadow-2xl rounded-xl w-[1000px] max-h-[1000px] flex flex-col">
                  <header className="flex items-center justify-between px-6 py-4 shadow-lg bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 rounded-t-xl">
                    <h2 className="text-xl font-bold text-white md:text-2xl">Modify Maintenance</h2>
                    <button onClick={closeEditMaintenanceModal} className="text-2xl text-white transition duration-200 hover:text-gray-300 md:text-3xl">&times;</button>
                  </header>      
            <div>
              <div className="px-6 py-6 space-y-6">
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  {/* Select Staff */}
                  <div className="w-full md:w-1/2">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Sub Category</label>
                    <Select
                      options={optionSubCate}
                      onChange={handleSubCate}
                      placeholder="Select Subcategory"
                      value={optionSubCate.find(
                        (option) => option.value === formData.subCategoryId
                      )}
                      isClearable
                      className="basic-single"
                      classNamePrefix="select"
                      styles={customStyles}
                    />
                  </div>
          
                  {/* User */}
                  <div className="w-full md:w-1/2">
                    <label
                      htmlFor="users"
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
                  {/* Technician */}
                  <div className="w-full md:w-1/2">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Technician</label>
                    <Select
                      options={optionTechnician}
                      onChange={handleTechnician}
                      placeholder="Select Subcategory"
                      value={optionTechnician.find(
                        (option) => option.value === formData.technician
                      )}
                      isClearable
                      className="basic-single"
                      classNamePrefix="select"
                      styles={customStyles}
                    />
                  </div>
          
                  {/* Last Maintenance Date */}
                  <div className="w-full md:w-1/2">
                    <label
                      htmlFor="lastMaintenance"
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
          
                {/* History */}
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  <div className="w-full">
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
          
              {/* Footer with buttons */}
              <footer className="flex justify-end flex-shrink-0 p-4 space-x-4 bg-gray-100 rounded-b-xl">
                <button
                  onClick={handleSaveEdit} // This function handles updating the maintenance data
                  className="w-full px-5 py-2 text-sm font-medium text-white transition duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-lg hover:scale-105 md:w-auto"
                >
                  Update
                </button>
          
                <button
                  onClick={closeEditMaintenanceModal}
                  className="w-full px-5 py-2 text-sm font-medium text-gray-700 transition duration-200 transform bg-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 md:w-auto"
                >
                  Cancel
                </button>
              </footer>
            </div>
          
                </div>
              </div>
      )}


{activeTab === "report" && (
  
  <div>
    <div className="px-6 py-6 space-y-6">
            <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
              <div className="w-full md:w-1/2">
                <label htmlFor="file" className="block mb-2 text-sm font-semibold text-gray-700">ឯកសារយោង</label>
                <input type="file" id="file" onChange={handleFileChange} accept=".pdf" className="block w-full text-sm border border-gray-300 rounded-lg shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 disabled:opacity-50 disabled:pointer-events-none text-neutral-400 file:border-0 file:me-4 file:py-3 file:px-4 file:bg-blue-600 file:text-white" />
                {selectedFiles.length > 0 && <p className="mt-2 text-sm text-gray-600">Selected file: {selectedFiles[0].name}</p>}
              </div>
              <div className="w-full md:w-1/2">
                <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-700">បរិយាយ</label>
                <input id="description" type="text" onChange={handleChange} value={formData.description} className="block w-full py-3 text-sm text-gray-800 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 text-center" required />
              </div>
            </div>
            <button onClick={handleFileUpload} className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Upload File</button>
          </div>
          <div className="px-6 py-6 space-y-6">
    {isLoadingFiles ? (
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
  </div>
)}

{activeTab === "add" &&(
          <div>
            <div className="px-6 py-6 space-y-6">
            <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
              <div className="w-full md:w-1/2">
              <label className="block mb-2 text-sm font-semibold text-gray-700">Sub Category</label>
                <Select
                    options={optionSubCate}
                    onChange={handleSubCate}
                    placeholder="Select Company Code"
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
            <div className="w-full md:w-1/2">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Technician</label>
                    <Select
                      options={optionTechnician}
                      onChange={handleTechnician}
                      placeholder="Select Subcategory"
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
              onClick={closeModal}
              className="w-full px-5 py-2 text-sm font-medium text-gray-700 transition duration-200 transform bg-gray-200 rounded-lg shadow-md hover:shadow-lg hover:scale-105 md:w-auto"
            >
              Cancel
            </button>
          </footer>
          </div>
        )}

        {/* Close Button */}
        {/* <button
          className="px-4 py-2 bg-red-500 text-white rounded-md mt-4"
          onClick={closeModal}
        >
          Close
        </button> */}
      </div>
    </div>
  );
};


export default Product
