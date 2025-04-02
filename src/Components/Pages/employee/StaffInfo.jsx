import React, { useState, useEffect } from "react";
import { FaPen, FaTrashAlt, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import TabMenu from "./TabMenu";
import AOS from "aos";
import "aos/dist/aos.css";
import { AiOutlineClose } from "react-icons/ai";
// import LongCourse from './LongCourse';
import { DelStaff, GetAllStaff } from "../../../api/user";
import {
  AddStaff,
  UpdateStaff,
  GetDep,
  GetUserLogin,
  GetPosition,
  GetAllComputerCourse,
  AddComputerCourse,
  UpdateComputerCourse,
} from "../../../api/user";
import { motion, useScroll } from "framer-motion";
import MenuTab from "./MenuTab";

const StaffInfo = () => {
  const INITIAL_FORM_DATA = {};
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Manage the selected item to edit
  const [editingEmployees, setEditingEmployees] = useState(null);
  const [employees, setEmployees] = useState([]);
  const { scrollYProgress } = useScroll();

  const [department, setDepartment] = useState([]);
  const [allOfficeOptions , setallOfficeOptions ] = useState([]);
  const [position, setPosition] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [photoName, setPhotoName] = useState("");
  const [ComputerCourse, setComputerCourse] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [filteredOfficeOptions, setFilteredOfficeOptions] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);

  const [errors, setErrors] = useState({});

  const nothingChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [submittedData, setSubmittedData] = useState(null);

  // const handleChange = (e) => {
  //   const { id, value } = e.target;
  //   setFormData(prevData => ({
  //     ...prevData,
  //     [id]: value
  //   }));
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  const [formData, setFormData] = useState({
    staffCode: "",
    engName: "",
    khName: "",
    height: "",
    weight: "",
    bod: "",
    currentAddress: "",
    genderCode: "",
    departCode: "",
    officeCode: "",
    branchCode: "",
    positionCode: "",
    fileUpload: null,
  });

  const [DataCourse, setDataCourse] = useState({
    coursename: "",
    courseCode: "",
    staffcode: "",
    staffname: "",
    fromdate: "",
    todate: "",
    organize: "",
    incountry: "",
    outcountry: "",
  });

  const offices = {
    1: ["HR Office 1", "HR Office 2"], // Offices under HR
    2: ["IT Office 1", "IT Office 2"], // Offices under IT
    3: ["Finance Office 1", "Finance Office 2"], // Offices under Finance
  };


  const fetchAllStaff = async () => {
    try {
      const response = await GetAllStaff();
      console.log("Full API Response:", response);
  
      if (Array.isArray(response.data?.data)) {
        setEmployees(response.data.data); // Update state only
      } else {
        console.error("Unexpected data format:", response.data);
        setEmployees([]); // Prevent old data from appearing
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmployees([]);
    }
  };
  
  useEffect(() => {
    

    const fetchAllDep = async () => {
      try {
        const response = await GetDep();
        console.log(response.data.data);
        setDepartment(response.data.data);
      } catch (err) {
        setErrors({ message: err.message || "An error occurred" });
      }
    };

    // const fetchFormData = async () => {
    //   try {
    //     const response = await GetAllStaff();
    //     console.log(response.data.data);
    //     setFormData(response.data.data);
    //     console.log("Form Data : ", formData)
    //   } catch (err) {
    //     setErrors({ message: err.message || "An error occurred" });
    //   }
    // };

    const fetchCurrentUser = async () => {
      try {
        const response = await GetUserLogin();
        setCurrentUser(response.data.data.username); // Assuming the response contains a username field
        console.log("Fetched user:", response.data.data.username);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    const fetchAllPostition = async () => {
      try {
        const response = await GetPosition();
        console.log(response.data.data);
        setPosition(response.data.data);
      } catch (err) {
        setErrors({ message: err.message || "An error occurred" });
      }
    };

    const fetchAllComputerCourse = async () => {
      try {
        const response = await GetAllComputerCourse();
        console.log(response.data.data);
        setComputerCourse(response.data.data);
      } catch (err) {
        setError({ message: err.message || "An error occurred" });
      }
    };

    fetchAllStaff();
    fetchAllDep();
    fetchCurrentUser();
    fetchAllPostition();
    fetchAllComputerCourse();
    // fetchFormData();
  }, []);

  const handleDepartmentChange = (selectedOption) => {
    console.log("Selected department option:", selectedOption);

    setFormData((prevData) => ({
      ...prevData,
      departCode: selectedOption ? selectedOption.value : "",
      officeCode: "", // Clear office selection when department changes
    }));

    if (selectedOption) {
      const filteredOffices = allOfficeOptions.filter(
        (office) => office.departmentId === selectedOption.value
      );
      setFilteredOfficeOptions(filteredOffices);
    } else {
      setFilteredOfficeOptions([]);
    }
  };

  const handleOfficeChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      officeCode: selectedOption ? selectedOption.value : "",
    }));
  };

  // const handleCourseChange = (selectedOption) => {
  //   console.log('Selected department option:', selectedOption);

  //   setFormData((prevData) => {
  //     const updatedData = {
  //       ...prevData,
  //       Course_Code: selectedOption ? selectedOption.value : '',
  //     };
  //     console.log('Updated formData:', updatedData); // Check if the updated data is correct
  //     return updatedData;
  //   });
  // };

  const handleCourseChange = (selected) => {
    setFormData((prev) => ({ ...prev, courseCode: selected }));
  };

  const handlePositionChange = (selectedOption) => {
    console.log("Selected department option:", selectedOption);

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        positionCode: selectedOption ? selectedOption.value : "",
      };
      console.log("Updated formData:", updatedData); // Check if the updated data is correct
      return updatedData;
    });
  };

  const handleStaffCode = (option) => {
    console.log("Selected option:", option); // Check if selectedOption has the correct value
    setSelectedOption(option);
    setDataCourse((prevData) => ({
      ...prevData,
      staffcode: option ? option.value : "",
    }));
  };

  const handleStaffName = (option) => {
    console.log("Selected option:", option); // Check if selectedOption has the correct value
    setSelectedOption(option);
    setDataCourse((prevData) => ({
      ...prevData,
      staffname: option ? option.value : "",
    }));
  };
  const optionsDepartment = department.map((dep) => ({
    value: dep.departCode,
    label: `${dep.departCode} - ${dep.departEngName}`,
  }));

  const optionsPosiotn = position.map((pos) => ({
    value: pos.positionCode,
    label: `${pos.positionCode} - ${pos.positionName}`,
  }));

  

  const viewDetails = (employeeId) => {
    // Fetch or set employee data based on employeeId
    const employeeData = {
      /* fetched or predefined employee data */
    };

    setFormData(employeeData);
    setIsReadOnly(true); // Set to read-only mode
    setIsEditModalOpen(true);
  };
  const clearDateFilter = () => {
    handleDateChange(""); // Reset the date to an empty string
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;

    setFormData({ ...formData, [e.target.id]: e.target.value });

    // Handle file input
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          picture: true,
          path: reader.result, // base64 string
        }));
      };

      reader.readAsDataURL(file);
    }
    // Handle date formatting
    else if (id === "bod") {
      const formattedDate = new Date(value).toISOString().split("T")[0];
      setFormData((prevData) => ({
        ...prevData,
        [id]: formattedDate,
      }));
    }
    // Handle family status as boolean
    else if (id === "familyStatus") {
      const booleanValue = value === "true"; // "true" for married, "false" for single
      setFormData((prevData) => ({
        ...prevData,
        [id]: booleanValue,
      }));
    }
    // Handle default case
    else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleChangeCourse = (e) => {
    const { id, value } = e.target;
    setDataCourse((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle the change for the select input (Staff Code)

  // Handle the change for radio buttons (Location)
  const handleLocationChange = (location) => {
    setDataCourse((prev) => ({
      ...prev,
      location: location,
    }));
  };

  // Handle the change for radio buttons (Course Type)
  const handleCourseTypeChange = (courseType) => {
    setDataCourse((prev) => ({
      ...prev,
      courseType: courseType,
    }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      photo: files[0],
    }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Add any additional logic here, such as filtering data based on the selected date
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
        const response = await DelStaff(id, currentUser);
        console.log("Response:", response); // Log the response to debug

        if (response.status === 200) {
          // Check HTTP status code directly
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success",
            confirmButtonText: "Okay",
          });

          const deleteStaff = employees.filter(
            (employee) => employee.id !== id
          );
          setEmployees(deleteStaff);
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

      if (error.response) {
        console.log("Error response:", error.response); // Full error response
      } else {
        console.log("Error message:", error.message); // Error message if no response
      }

      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message || "Failed to connect to the server.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };
  const handleSaveEmployee = async (e) => {
    e.preventDefault(); // Fix: Prevent form submission
  
    const updatedFormData = {
      // ...formData, 
      // formData,
      staffCode: formData.staffCode,
      engName: formData.engName,
      khName: formData.khName,
      branchCode: formData.branchCode,
      departCode: formData.departCode,
      createdBy: currentUser,
      lastBy: currentUser,
      lastDate: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };
  
    try {
      console.log("Saving employee data:", updatedFormData);
      const response = await AddStaff(updatedFormData);
  
      console.log("Employee add response:", response);
  
      Swal.fire({
        title: "Success!",
        text: "User created successfully.",
        icon: "success",
      });
  
      isAddModalOpen(false); // Fix: should be `setIsAddModalOpen(false)`
      fetchAllStaff();
    } catch (error) {
      console.error("Error during user creation:", error);
  
      if (error.response) {
        const errorMessage = error.response.data.message || "Error during user creation";
        setErrors({
          general: errorMessage.includes("User already exists")
            ? "This user already exists. Please use a different username or email."
            : errorMessage,
        });
      } else {
        setErrors({ general: "Network error" });
      }
  
      Swal.fire({
        title: "Error!",
        text: errors.general || "There was an error creating the user. Please try again.",
        icon: "error",
      });
    }
  };
  
  const handleSaveEdit = async (e) => {
    e.preventDefault(); // Fix: Prevent form submission
  
    try {
      console.log("Saving employee data:", formData);
      const id = editingStaff.id;
  
      // if (!id) {
      //   Swal.fire({
      //     title: "Error",
      //     text: "ID is missing",
      //     icon: "warning",
      //   });
      //   return;
      // }
  
      const updatedFormData = {
        ...formData,
        lastBy: currentUser, // Fix: match casing with `lastBy`
        lastDate: new Date().toISOString(),
      };
  
      const response = await UpdateStaff(id, updatedFormData);
  
      if (response.status === 200) {
        console.log("Employee updated successfully:", response.data);
        Swal.fire({
          title: "Success!",
          text: "Employee updated successfully",
          icon: "success",
        });
  
        setIsEditModalOpen(false);
        fetchAllStaff();
      } else {
        Swal.fire({
          title: "Error",
          text: "Error: " + (response.data.message || "An unexpected error occurred."),
          icon: "warning",
        });
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        alert(`Error: ${error.response.data.message || "An unexpected error occurred."}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("No response received from the server.");
      } else {
        console.error("Error message:", error.message);
        alert("An error occurred while setting up the request.");
      }
    }
  };
  

  const handleViewSave = () => {
    setIsViewModalOpen(false);
  };

  const saveAllModal = async (e) => {
    e?.preventDefault(); // Prevent default behavior if an event is provided
  
    if (isAddModalOpen) {
      await handleSaveEmployee(e); // Pass event
    } else if (isEditModalOpen) {
      await handleSaveEdit(e); // Pass event
    } else if (isViewModalOpen) {
      await handleViewSave(e); // Pass event
    }
  };
  

  const handleSaveCourse = async () => {
    // Ensure formData has the correct structure with all fields
    const updatedFormData = {
      ...DataCourse, // Spread existing form data
      staffcode: DataCourse.staffcode || "", // Ensure staffcode is set
      staffname: DataCourse.staffname || "",
      createBy: currentUser, // Use the fetched username as creator
      lastBy: currentUser, // Use the fetched username as updater
      lastDate: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };

    try {
      console.log("Saving employee data:", updatedFormData);
      const response = await AddComputerCourse(updatedFormData);

      if (response.status === 200) {
        console.log("Employee saved successfully:", response);
        Swal.fire({
          title: "Successful",
          text: "Employee created successfully",
          icon: "success",
        });
        setIsAddModalOpen(false);
      } else {
        // Handle errors based on status codes
        const errorMessage =
          response.data.message || "An unexpected error occurred.";
        if (response.status === 409) {
          // Conflict error
          Swal.fire({
            title: "Error",
            text: "Staff already exists: " + errorMessage,
            icon: "warning",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Error: " + errorMessage,
            icon: "warning",
          });
        }
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        Swal.fire({
          title: "Error",
          text: `Error: ${
            error.response.data.message || "An unexpected error occurred."
          }`,
          icon: "warning",
        });
      } else if (error.request) {
        console.error("Error request:", error.request);

        Swal.fire({
          title: "Error",
          text: "No response received from the server.",
          icon: "warning",
        });
      } else {
        console.error("Error message:", error.message);

        Swal.fire({
          title: "Error",
          text: "An error occurred while setting up the request.",
          icon: "warning",
        });
      }
    }
  };

  const handleSaveEditCourse = async () => {
    try {
      console.log("Saving employee data:", formData);
      const id = formData.id; // Ensure this is valid
      if (!id) {
        Swal.fire({
          title: "Error",
          text: "ID are missing",
          icon: "warning",
        });
        return;
      }
      const response = await UpdateComputerCourse(id, formData);

      if (response.status === 200) {
        console.log("Employee updated successfully:", response.data);
        Swal.fire({
          title: "Successful",
          text: "Employee update successfully",
          icon: "success",
        });
        setIsEditModalOpen(false); // Close the edit modal
      } else {
        const errorMessage =
          response.data.message || "An unexpected error occurred.";
        // alert('Error: ' + errorMessage);
        Swal.fire({
          title: "Successful",
          text: "Error :" + errorMessage,
          icon: "warning",
        });
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error response data:", error.response.data);
        alert(
          `Error: ${
            error.response.data.message || "An unexpected error occurred."
          }`
        );
      } else if (error.request) {
        // Request was made but no response received
        console.error("Error request:", error.request);
        alert("No response received from the server.");
      } else {
        // Error setting up the request
        console.error("Error message:", error.message);
        alert("An error occurred while setting up the request.");
      }
    }
  };

  const saveAllModalCourse = async () => {
    if (isAddModalOpen) {
      await handleSaveCourse();
    } else if (isEditModalOpen) {
      await handleSaveEditCourse();
    }
  };

  const recordsPerPage = 8;
  //open edit modal
  const openEditModal = (
    staffCode,
    engName,
    khName,
    genderCode,
    height,
    weight,
    bod,
    currentAddress,
    branchCode,
    departCode,
    officeCode,
    positionCode,
    coursename,
    courseCode,
    fromdate,
    todate,
    organize,
    incountry,
    outcountry
  ) => {
    console.log({
      staffCode,
      engName,
      khName,
      genderCode,
      height,
      weight,
      bod,
      currentAddress,
      branchCode,
      departCode,
      officeCode,
      positionCode,
      coursename,
      courseCode,
      fromdate,
      todate,
      organize,
      incountry,
      outcountry,
    });

    setEditingEmployees({
      staffCode,
      engName,
      khName,
      genderCode,
      height,
      weight,
      bod,
      currentAddress,
      branchCode,
      departCode,
      officeCode,
      positionCode,
    });

    setFormData({
      staffCode,
      engName,
      khName,
      genderCode,
      height,
      weight,
      bod,
      currentAddress,
      branchCode,
      departCode,
      officeCode,
      positionCode,
      fileUpload: null, // Retaining fileUpload initialization
    });

    setDataCourse({
      coursename,
      courseCode,
      staffcode: staffCode,
      staffname: engName,
      fromdate,
      todate,
      organize,
      incountry,
      outcountry,
    });

    setIsEditModalOpen(true);
  };

  const openViewModal = (
    id,
    staffCode,
    engName,
    khName,
    genderCode,
    height,
    weight,
    bod,
    currentAddress,
    branchCode,
    departCode,
    positionCode
  ) => {
    console.log({
      id,
      staffCode,
      engName,
      khName,
      genderCode,
      height,
      weight,
      bod,
      currentAddress,
      branchCode,
      departCode,
      positionCode,
    });

    setEditingEmployees({
      id,
      staffCode,
      engName,
      khName,
      genderCode,
      height,
      weight,
      bod,
      currentAddress,
      branchCode,
      departCode,
      positionCode,
    });

    setFormData({
      id,
      staffCode,
      engName,
      khName,
      genderCode,
      height,
      weight,
      bod,
      currentAddress,
      branchCode,
      departCode,
      positionCode,
    });
    setIsViewModalOpen(true);
  };
  const isDisabled = openViewModal;

  const closeEmployeeModal = () => {
    setIsAddModalOpen(false);
  };
  //close edit modal
  const closeEditModal = () => {
    setEditingEmployees(null);
    setFormData({
      id: "",
      staffCodeode: "",
      engName: "",
      khName: "",
      genderCode: "",
      height: "",
      weight: "",
      bod: "",
      currentAddress: "",
      branchCode: "",
      departCode: "",
      positionCode: "",
    });
    setIsEditModalOpen(false);
  };

  const closeViewModal = () => {
    setEditingEmployees(null);
    setFormData({
      id: "",
      staffCodeode: "",
      engName: "",
      khName: "",
      genderCode: "",
      height: "",
      weight: "",
      bod: "",
      currentAddress: "",
      branchCode: "",
      departCode: "",
      positionCode: "",
    });
    setIsViewModalOpen(false);
  };

  const closeAllModals = () => {
    if (isAddModalOpen) {
      closeEmployeeModal();
    } else if (isEditModalOpen) {
      closeEditModal();
    } else if (isViewModalOpen) {
      closeViewModal();
    }
  };

  //Update and Save
  const updateClick = () => {
    Swal.fire({
      position: "center", // Change to 'center' to center the alert
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Staff has been deleted.",
          icon: "success",
        });
      }
    });
  };
  // const handleSearch = () => {
  //   let filteredUsers;
  //   if (searchTerm === "username") {
  //     filteredUsers = users.filter((user) =>
  //       user.username.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   } else if (searchTerm === "id") {
  //     filteredUsers = users.filter((user) =>
  //       user.id.toString().includes(searchTerm)
  //     );
  //   }
  //   // Handle the display or processing of `filteredUsers`
  //   console.log(filteredUsers);
  // };

  useEffect(() => {
    console.log("Filtering employees:", employees); // Debugging
    if (employees.length === 0) {
      setFilteredEmployees([]); // Prevent old/stale data
    } else {
      setFilteredEmployees(
        employees.filter(
          (employee) =>
            (employee.engname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.staffcode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.khname || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [employees, searchTerm]);
  
  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const getPaginationItems = () => {
    let pages = [];
    if (totalPages <= 7) {
      pages = [...Array(totalPages)].map((_, index) => index + 1);
    } else {
      if (currentPage < 4) {
        pages = [1, 2, 3, "...", totalPages];
      } else if (currentPage > totalPages - 3) {
        pages = [1, "...", totalPages - 3, totalPages - 2, totalPages];
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

  return (
    <section className="mt-14 font-khmer">
      <h1 className="text-xl font-medium text-blue-800">
        តារាងបង្ហាញព័ត៌មានបុគ្គលិក
      </h1>
      <div className="mt-3 border"></div>
      <div className="w-full mt-4" data-aos="fade-up">
        <div className="relative w-full overflow-hidden bg-white shadow-md sm:rounded-lg">
          <div className="flex flex-col items-center justify-between p-4 space-y-4 md:flex-row md:space-y-0">
            {/* Search Input */}
            <div className="w-full md:w-full lg:w-[600px]">
              <form className="flex items-center justify-start">
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
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="block w-full p-3 pl-10 pr-10 text-sm text-gray-900 border border-gray-400 rounded-3xl bg-gray-50 focus:ring-primary-700 focus:border-primary-700 focus:outline-none focus:ring-1"
                    placeholder="Search Fullname or Code"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute flex items-center justify-center w-10 h-10 pr-3 text-gray-500 inset-y-1 right-2 hover:text-gray-700 focus:outline-none"
                    >
                      <AiOutlineClose className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Date Filter with Label and Clear Button */}
            {/* <div className="flex flex-wrap items-center justify-end w-full mr-3 space-x-3 md:w-full md:justify-end ">
              <label
                htmlFor="date-filter"
                className="text-sm font-medium text-gray-700"
              >
                Filter by Date:
              </label>
              <input
                type="date"
                id="date-filter"
                className="p-3 text-sm text-gray-900 border border-gray-400 rounded-3xl bg-gray-50 focus:ring-primary-700 focus:border-primary-700 focus:outline-none focus:ring-1"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
              <button
                type="button"
                className="px-6 py-3 text-sm font-medium text-red-700 duration-300 bg-red-200 rounded-3xl hover:bg-red-300 focus:ring-2 focus:ring-red-400"
                onClick={() => clearDateFilter()}
              >
                សម្អាត
              </button>
            </div> */}

            {/* Add Information Button */}
            <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-blue-600 duration-300 bg-blue-200 rounded-3xl hover:bg-blue-300 focus:ring-4 focus:ring-primary-300"
                onClick={() => setIsAddModalOpen(true)}
              >
                <svg
                  className="h-3.5 w-3.5 mr-3"
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
                <p className="text-sm font-normal">បញ្ចូលព័ត៌មានបុគ្គលិក</p>
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto" data-aos="fade-right">
            <table className="w-full text-sm text-left text-gray-700 border-collapse">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-200 border-b">
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 px-4 py-3 mr-3 border-t border-r bg-gray-200"
                  >
                    Action
                  </th>
                  {/* <th scope="col" className="px-4 py-3 border-t border-r">
                    NO
                  </th> */}
                  <th
                    scope="col"
                    className="px-4 py-3 border-t border-r"
                    style={{ minWidth: "120px" }}
                  >
                    staff Code
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-t border-r"
                    style={{ minWidth: "200px" }}
                  >
                    English Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-t border-r"
                    style={{ minWidth: "200px" }}
                  >
                    Khhmer Name
                  </th>
                  <th scope="col" className="px-4 py-3 border-t border-r">
                    Gender
                  </th>
                  <th scope="col" className="px-4 py-3 border-t border-r">
                    Height
                  </th>
                  <th scope="col" className="px-4 py-3 border-t border-r ">
                    Weight
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-t border-r"
                    style={{ minWidth: "170px" }}
                  >
                    Birthdate
                  </th>
                  <th scope="col" className="px-4 py-3 border-t border-r">
                    Course
                  </th>
                  {/* <th scope="col" className="px-4 py-3 border-t border-r"style={{ minWidth: '120px' }}>Nationality</th>
                    <th scope="col" className="px-4 py-3 border-t border-r"style={{ minWidth: '120px' }}>Region</th>
                    <th scope="col" className="px-4 py-3 border-t border-r"style={{ minWidth: '330px' }}>Birthdate Address</th> */}
                  <th
                    scope="col"
                    className="px-4 py-3 border-t border-r"
                    style={{ minWidth: "330px" }}
                  >
                    Address
                  </th>
                  {/* <th scope="col" className="px-4 py-3 border-t border-r" style={{ minWidth: '150px'}}>Phone Number</th>
                    <th scope="col" className="px-4 py-3 border-t border-r" style={{ minWidth: '220px' }}>Email</th>
                    <th scope="col" className="px-4 py-3 border-t border-r"style={{ minWidth: '150px' }}>Special Number</th>
                    <th scope="col" className="px-4 py-3 border-t border-r"style={{ minWidth: '140px' }}>Marital Status</th>
                    <th scope="col" className="px-4 py-3 border-t border-r"style={{ minWidth: '200px' }}>Company</th> */}
                  <th scope="col" className="px-4 py-3 border-t border-r">
                    Branch
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-t border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-t border-r"
                    style={{ minWidth: "150px" }}
                  >
                    Office
                  </th>
                  {/* <th scope="col" className="px-4 py-3 border-t border-r"style={{ minWidth: '250px' }}>Office</th> */}
                  <th
                    scope="col"
                    className="px-4 py-3 border-t border-r"
                    style={{ minWidth: "250px" }}
                  >
                    Position
                  </th>
                  <th
                    scope="col"
                    className="px-4 border-t border-r py-30"
                    style={{ minWidth: "200px" }}
                  >
                    Last Modified By
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-t border-r"
                    style={{ minWidth: "250px" }}
                  >
                    Last Modified Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 border-t border-r"
                    style={{ minWidth: "250px" }}
                  >
                    Photo
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="sticky left-0 z-10 flex items-center px-4 py-5 bg-white border-r">
                      <input type="checkbox" className="mr-3 action-checkbox" />
                      <FaPen
                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                        onClick={() =>
                          openEditModal(
                            // employee.id,
                            employee.staffCode,
                            employee.engName,
                            employee.khName,
                            employee.genderCode,
                            employee.height,
                            employee.weight,
                            employee.bod,
                            employee.currentAddress,
                            employee.branchCode,
                            employee.departCode,
                            employee.positionCode,
                            employee.lastBy,
                            employee.lastDate,
                            employee.photo
                          )
                        }
                      />
                      <FaEye
                        className="ml-3 text-indigo-500 cursor-pointer hover:text-indigo-700"
                        onClick={() =>
                          openViewModal(
                            employee.id,
                            employee.staffCode,
                            employee.engName,
                            employee.khName,
                            employee.genderCode,
                            employee.height,
                            employee.weight,
                            employee.bod,
                            employee.currentAddress,
                            employee.branchCode,
                            employee.departCode,
                            employee.officeCode,
                            employee.positionCode,
                            employee.lastBy,
                            employee.lastDate,
                            employee.photo
                          )
                        }
                      />
                      <FaTrashAlt
                        className="ml-3 text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => handleDelete(employee.id)}
                      />
                    </td>

                    {/* <td className="px-4 py-1 border-r">{employee.id}</td> */}
                    <td className="px-4 py-3 border-r whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px">{employee.staffCode}</td>
                    <td className="px-4 py-3 border-r whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px">{employee.engName}</td>
                    <td className="px-4 py-3 border-r whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px">{employee.khName}</td>
                    <td className="px-4 py-3 border-r whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px">
                      {employee.genderCode}
                    </td>
                    <td className="px-4 py-1 border-r">{employee.height}</td>
                    <td className="px-4 py-1 border-r">{employee.weight}</td>
                    <td className="px-4 py-1 border-r">
                      {formatDateTime(employee.bod)}
                    </td>
                    <td className="px-4 py-1 border-r">
                      {employee.courseCode}
                    </td>
                    {/* <td className='px-4 py-1 border-r'>{employee.nationality}</td>
                      <td className='px-4 py-1 border-r'>{employee.region}</td> */}
                    {/* <td className='px-4 py-1 border-r'>{employee.birthdateAddress}</td> */}
                    <td className="px-4 py-1 border-r">
                      {employee.currentAddress}
                    </td>
                    {/* <td className='px-4 py-1 border-r'>{employee.phoneNumber1}</td> */}
                    {/* <td className='px-41py-3'>{emoyee.phoneNumber2}</td>
                      <td className='px-4 py-1'>{employ.phoneNumber3}</td> */}
                    {/* <td className='px-4 py-1 border-r'>{employee.email}</td>
                      <td className='px-4 py-1 border-r'>{employee.specailPhoneNumber}</td> */}
                    {/* <td className='px-4 py-1 border-r'>{employee.familyStatus ? 'Married' : 'Single'}</td> */}
                    {/* <td className='px-4 py-1 border-r'>{employee.companyCode}</td> */}
                    <td className="px-4 py-1 border-r">
                      {employee.branchCode}
                    </td>
                    <td className="px-4 py-1 border-r">
                      {employee.departCode}
                    </td>
                    <td className="px-4 py-1 border-r">
                      {employee.officeCode}
                    </td>
                    {/* <td className='px-4 py-1 border-r'>{employee.officeCode}</td> */}
                    <td className="px-4 py-1 border-r">
                      {employee.positionCode}
                    </td>
                    <td className="px-4 py-1 border-r">{employee.lastBy}</td>
                    <td className="px-4 py-1 border-r">
                      {formatDateTime(employee.lastDate)}
                    </td>
                    <td className="px-4 py-1 border-r">{employee.photo}</td>
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
                    className={`flex items-center justify-center py-2 px-3 text-gray-500 bg-white border rounded-lg shadow-sm hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500  ${
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
                      <span className="flex items-center justify-center px-3 py-2 text-gray-500 bg-white border rounded-lg shadow-sm ">
                        ...
                      </span>
                    </li>
                  ) : (
                    <li key={index}>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`flex items-center justify-center py-2 px-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500   ${
                          currentPage === page
                            ? "bg-blue-500 text-white border-blue-600"
                            : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
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
                    className={`flex items-center justify-center py-2 px-3 text-gray-500 bg-white border rounded-lg shadow-sm hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500   ${
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
                        d="M7.707 14.707a1 1 0 010-1.414L11.586 10 7.707 6.121a1 1 0 111.414-1.414l4.293 4.293a1 1 0 010 1.414l-4.293 4.293a1 1 0 01-1.414 0z"
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm ">
          <div
            className="relative w-full max-w-xl sm:max-w-5xl md:max-w-4xl lg:max-w-4xl bg-white rounded-md shadow-lg overflow-auto max-h-[90vh] h-[73vh] sm:h-[550px] md:h-[550px] modal-scrollbar mt-14 sm:ml-52 md:ml-0"
            data-aos="zoom-in"
          >
            <div className="sticky top-0 z-50 flex items-center justify-between w-full p-4 py-4 mb-6 bg-gray-100 border-b-2 border-gray-300 border-dashed">
              <h2 className="flex-1 ml-3 text-xl font-medium text-blue-800 sm:text-2xl md:text-2xl font-khmer leading-2">
                បញ្ចូលព័ត៌មានបុគ្គលិក
              </h2>
              <button
                type="button"
                onClick={closeEmployeeModal}
                className="px-2 py-2 mr-2 text-gray-500 bg-gray-100 rounded-md hover:text-gray-700 ring-1 ring-gray-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="px-4">
              <MenuTab
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                handleChange={handleChange}
                handleSaveEmployee={handleSaveEmployee}
                closeEmployeeModal={closeEmployeeModal}
                closeEditModal={closeEditModal}
                closeViewModal={closeViewModal}
                saveAllModal={saveAllModal}
                offices={offices}
                department={optionsDepartment}
                handleDepartmentChange={handleDepartmentChange}
                handlePositionChange={handlePositionChange}
                handleCourseChange={handleCourseChange}
                handleStaffCode={handleStaffCode}
                saveAllModalCourse={saveAllModalCourse}
                DataCourse={DataCourse}
                handleLocationChange={handleLocationChange}
                handleCourseTypeChange={handleCourseTypeChange}
                handleChangeCourse={handleChangeCourse}
                handleStaffName={handleStaffName}
                handleOfficeChange={handleOfficeChange}
                filteredOfficeOptions={filteredOfficeOptions}
                // disabled={isDisabled}
              />
            </div>
            {/* <div className="flex justify-center gap-5 p-6 mt-4">
        <button
          type="submit"
          onClick={handleSaveEmployee}
          // onClick={updateClick}
          className="px-8 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
        >
        <p className='text-base font-normal'>រក្សាទុក</p>
        </button>
        <button
        type="button"
          onClick={closeEmployeeModal}
          className="px-6 py-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 border-dashed rounded-lg shadow-sm hover:bg-gray-100"
          >
          <p className='text-base font-normal'>ចាកចេញ</p>
        </button>
      </div> */}
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md sm:max-w-4xl bg-white rounded-md shadow-lg overflow-auto max-h-[90vh] mt-14 sm:ml-52 h-[550px] modal-scrollbar">
            <div className="sticky top-0 z-50 flex items-center justify-between w-full p-4 mb-6 bg-gray-100 border-b border-gray-300 border-dashed">
              <h2 className="flex-1 ml-3 text-2xl font-medium text-blue-800 font-khmer">
                កែប្រែព័ត៌មានបុគ្គលិក
              </h2>
              <button
                type="button"
                onClick={closeEditModal}
                className="px-2 py-2 mr-2 text-gray-500 bg-gray-100 rounded-md hover:text-gray-700 ring-1 ring-gray-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div>
              <MenuTab
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                handleChange={handleChange}
                handleSaveEmployee={handleSaveEmployee}
                closeEmployeeModal={closeEmployeeModal}
                closeEditModal={closeEditModal}
                closeViewModal={closeViewModal}
                saveAllModal={saveAllModal}
                offices={offices}
                department={optionsDepartment}
                handleDepartmentChange={handleDepartmentChange}
                handlePositionChange={handlePositionChange}
                handleCourseChange={handleCourseChange}
                handleStaffCode={handleStaffCode}
                saveAllModalCourse={saveAllModalCourse}
                DataCourse={DataCourse}
                handleLocationChange={handleLocationChange}
                handleCourseTypeChange={handleCourseTypeChange}
                handleChangeCourse={handleChangeCourse}
                handleStaffName={handleStaffName}
              />
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md sm:max-w-4xl bg-white rounded-md shadow-lg overflow-auto max-h-[90vh] mt-14 sm:ml-52 h-[550px] modal-scrollbar">
            <div className="sticky top-0 z-50 flex items-center justify-between w-full p-4 mb-6 bg-gray-100 border-b border-gray-300 border-dashed">
              <h2 className="flex-1 ml-3 text-2xl font-medium text-blue-800 font-khmer">
                មើលព័ត៌មានបុគ្គលិក
              </h2>
              <button
                type="button"
                onClick={closeViewModal}
                className="px-2 py-2 mr-2 text-gray-500 bg-gray-100 rounded-md hover:text-gray-700 ring-1 ring-gray-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div>
              <MenuTab
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleSaveEmployee={handleSaveEmployee}
                closeEmployeeModal={closeEmployeeModal}
                closeEditModal={closeAllModals}
                closeViewModal={closeViewModal}
                saveAllModal={saveAllModal}
                disabled={isDisabled}
              />
            </div>
          </div>
        </div>
      )}
      {/* <div> 
        <LongCourse/>
      </div> */}
    </section>
  );
};
export default StaffInfo;
