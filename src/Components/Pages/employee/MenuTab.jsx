import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import Select from "react-select";
import { motion, useScroll } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {
  GetDep,
  GetPosition,
  GetOffice,
  GetAllComputerCourse,
  GetAllStaff,
} from "../../../api/user";
import { MultiSelect } from "react-multi-select-component";

const MenuTab = ({
  formData,
  // errors,
  handleChange,
  // handleSaveEmployee,
  closeEmployeeModal,
  closeViewModal,
  closeEditModal,
  saveAllModal,
  disabled,
  offices,
  // department,
  // handleDepartmentChange,
  handlePositionChange,
  handleCourseChange,
  handleStaffCode,
  saveAllModalCourse,
  DataCourse,
  handleCourseTypeChange,
  handleLocationChange,
  handleChangeCourse,
  handleStaffName,
  filteredOfficeOptions,
  setFormData
  // handleOfficeChange
}) => {
  const [activeTab, setActiveTab] = useState("បញ្ចូលព័ត៌មានបុគ្គលិក"); // Track the active tab
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const { scrollYProgress } = useScroll();
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [department, setDepartment] = useState([]);
  const [position, setPosition] = useState([]);
  const [office, setOffice] = useState([]);
  const [ComputerCourse, setComputerCourse] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [optionsDepartment, setOptionsDepartment] = useState([]);
  const [optionsOffice, setOptionsOffice] = useState([]);
  const [loadingOffices, setLoadingOffices] = useState(false);
  // const [formData, setFormData] = useState({
  //   departCode: '',
  //   officeCode: '',
  // });
  // const [formData, setFormData] = useState({
  //   id: '',
  //   staffCodeode: '',
  //   fullname: '',
  //   lastname: '',
  //   gender: '',
  //   height: '',
  //   weight: '',
  //   birthdate: '',
  //   nationality: '',
  //   region: '',
  //   birthaddress: '',
  //   address: '',
  //   phone: '',
  //   email: '',
  //   specialNumber: '',
  //   maritalStatus: '',
  //   company: '',
  //   branch: '',
  //   department: '',
  //   office: '',
  //   position: '',
  //   photo: null,
  // });

  // const isDisabled = !isAddModalOpen && !isEdi

  const [newCourse, setNewCourse] = useState({
    from: "",
    to: "",
    course: "",
    organize: "",
    inCountry: true,
    lastBy: "",
  });

  useEffect(() => {
    const fetchAllDep = async () => {
      try {
        const response = await GetDep();
        console.log("Dep:",response.data.data); // Debugging log
    
        // Convert API response to react-select format
        const departmentOptions = response.data.data.map((dept) => ({
          value: dept.departCode,  // Assuming "departCode" is the unique ID
          label: dept.departEngName,  // Assuming "departName" is the display name
        }));
    
        setDepartment(departmentOptions);
        console.log("Dep option" , departmentOptions);
      } catch (err) {
        setErrors({ message: err.message || "An error occurred" });
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

    // const fetchAllOffice = async () => {
    //   try {
    //     const response = await GetOffice();
    //     console.log("Office: ",response.data.data);
    //     setOffice(response.data.data);
    //   } catch (err) {
    //     setErrors({ message: err.message || "An error occurred" });
    //   }
    // };

    const fetchAllComputerCourse = async () => {
      try {
        const response = await GetAllComputerCourse();
        console.log(response.data.data);
        setComputerCourse(response.data.data);
      } catch (err) {
        setErrors({ message: err.message || "An error occurred" });
      }
    };
    const fetchEmployees = async () => {
      try {
        const response = await GetAllStaff();
        setEmployees(response.data.data);
      } catch (err) {
        setErrors(err.message || "An error occurred");
      }
    };
    // const fetchAllOffice = async () => {
    //   try {
    //     const response = await GetOffice();
    //     console.log(response.data.data);
    //     setOffice(response.data.data);

    //   } catch (err) {
    //     setErrors({ message: err.message || 'An error occurred' });
    //   }
    // };
    fetchAllComputerCourse();
    fetchAllDep();
    fetchAllPostition();
    // fetchAllOffice();
    fetchEmployees();
  }, []);


  // useEffect(() => {
  //   axios.get("http://192.168.100.55:8759/department/findAllDepartmen")
  //     .then((response) => {
  //       const departmentOptions = response.data.map((dept) => ({
  //         value: dept.departCode,
  //         label: dept.departName,
  //       }));
  //       setOptionsDepartment(departmentOptions);
  //       console.log("Department  : ", departmentOptions);
  //     })
  //     .catch((error) => console.error("Error fetching departments:", error));
  // }, []);

  const handleDepartmentChange = async (selectedOption) => {
    console.log("Selected department:", selectedOption);

    setFormData((prevData) => ({
      ...prevData,
      departCode: selectedOption ? selectedOption.value : "",
      officeCode: "", // Reset office selection
    }));

    if (!selectedOption) {
      setOptionsOffice([]); // Clear office options if no department is selected
      return;
    }

    // Fetch offices based on department ID
    setLoadingOffices(true);
    try {
      const response = await axios.get(`http://192.168.100.55:8759/Office/selectOfficeFromDepartmentByDepartCode/${selectedOption.value}`);
      const officeOptions = response.data.data.map((office) => ({
        value: office.officeCode,
        label: office.officeEngName,
      }));
      setOptionsOffice(officeOptions);
      console.log("Office : " ,optionsOffice)
    } catch (error) {
      console.error("Error fetching offices:", error);
      setOptionsOffice([]);
    }
    setLoadingOffices(false);
  };

  const handleOfficeChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      officeCode: selectedOption ? selectedOption.value : "",
    }));
  };

  const optionsStaffCode = employees.map((employee) => ({
    value: employee.staffCode, // Use a plain string
    label: `${employee.staffCode}-${employee.engName}`,
  }));

  const optionsStaffName = employees.map((employee) => ({
    value: employee.khName, // Use a plain string
    label: `${employee.staffCode}-${employee.khName}`,
  }));

  // const handleDepartmentChange = (selectedOption) => {
  //   console.log('Selected department option:', selectedOption);

  //   formData((prevData) => {
  //     const updatedData = {
  //       ...prevData,
  //       departCode: selectedOption ? selectedOption.value : '',
  //     };
  //     console.log('Updated formData:', updatedData); // Check if the updated data is correct
  //     return updatedData;
  //   });
  // };
  // const optionsDepartment = department.map((dep) => ({
  //   value: dep.departCode,
  //   label: `${dep.departCode} - ${dep.departEngName}`,
  // }));

  const optionsPosiotn = position.map((pos) => ({
    value: pos.positionCode,
    label: `${pos.positionCode} - ${pos.positionName}`,
  }));

  const optionCourse = ComputerCourse.map((course) => ({
    value: course.courseCode,
    label: `${course.courseCode} - ${course.courseName}`,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  // const handleDepartmentChange = (e) => {
  //   const selectedDepartment = e.target.value;

  //   // Update form data
  //   setFormData(prev => ({
  //     ...prev,
  //     department: selectedDepartment,
  //     office: '', // Reset office when department changes
  //   }));

  //   // Filter the offices based on selected department
  //   if (offices[selectedDepartment]) {
  //     setFilteredOffices(offices[selectedDepartment]);
  //   } else {
  //     setFilteredOffices([]); // Clear the office dropdown if no department selected
  //   }
  // };

  // Handle office change
  // const handleOfficeChange = (e) => {
  //   const selectedOffice = e.target.value;

  //   // Update form data
  //   setFormData((prev) => ({
  //     ...prev,
  //     office: selectedOffice,
  //   }));
  // };

  const options = [
    // { value: 'manager', label: 'Manager' },
    // { value: 'developer', label: 'Developer' },
    // { value: 'designer', label: 'Designer' },
    // { value: 'manager', label: 'Manager' },
    // { value: 'manager', label: 'Manager' },
    // { value: 'developer', label: 'Developer' },
    // { value: 'designer', label: 'Designer' },
    // { value: 'manager', label: 'Manager' },
    // { value: 'manager', label: 'Manager' },
    // { value: 'developer', label: 'Developer' },
    // { value: 'designer', label: 'Designer' },
    // { value: 'manager', label: 'Manager' },
  ];

  // const closeEmployeeModal = () => {
  //   setIsAddModalOpen(false);
  // };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeAllModals = () => {
    closeEmployeeModal();
    closeEditModal();
    closeViewModal();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const handleShowImage = () => {
    if (imageUrl) {
      window.open(imageUrl, "_blank");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsDropdownOpen(false); // Close dropdown on tab change
  };

  // const handleChange = (e) => {
  //   const { id, value } = e.target;
  //   setFormData(prevData => ({
  //     ...prevData,
  //     [id]: value
  //   }));
  // };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(newCourse);
  };
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: "150px", // Limits the dropdown height to 150px
      overflowY: "auto", // Allows scrolling when content exceeds height
      fontFamily: "Noto Serif Khmer", // Custom font
      fontSize: "14px", // Adjust the font size as needed
      zIndex: 9999, // Ensures the dropdown appears above other elements
      WebkitOverflowScrolling: "touch", // Smooth scrolling for touch devices
    }),
    // menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensures
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensures the portal is on top of other elements
    }),
    control: (provided, state) => ({
      ...provided,
      background: "#fff",
      borderColor: "#9e9e9e",
      minHeight: "30px",
      height: "45px",
      boxShadow: state.isFocused ? null : null,
    }),
  };
  const [bod, setBod] = useState(null);

  const handleDateChange = (date) => {
    if (!date) return;
  
    const formattedDateTime = new Date(date).toLocaleString(); // Convert to local date-time
    setBod(formattedDateTime);
    handleChange({ target: { id: "bod", value: formattedDateTime } });
  };
  

  

  // const optionsOffice = office.map((off) => ({
  //   value: off.officeCode,
  //   label: `${off.officeCode} - ${off.officeEngName}`,
  // }));
  

  return (
    <div className="relative" data-aos="zoom-in-up duration-1000">
      <div className="w-full p-4">
        <div className="flex space-x-4 border-b">
          <button
            className={`p-2 ${
              activeTab === "បញ្ចូលព័ត៌មានបុគ្គលិក"
                ? "border-b-2 border-blue-500"
                : ""
            }`}
            onClick={() => setActiveTab("បញ្ចូលព័ត៌មានបុគ្គលិក")}
          >
            បញ្ចូលព័ត៌មានបុគ្គលិក
          </button>
          <button
            className={`p-2 ${
              activeTab === "វគ្គសិក្សា" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("វគ្គសិក្សា")}
          >
            វគ្គសិក្សា
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "បញ្ចូលព័ត៌មានបុគ្គលិក" && (
          <div className="overflow-auto ">
            <form >
              <div
                className="grid grid-cols-1 gap-6 px-8 py-2 mt-4 sm:grid-cols-2"
                data-aos="zoom-in"
              >
                {[
                  {
                    id: "staffCode",
                    label: "អត្ថលេខ",
                    type: "text",
                    required: true,
                  },
                  {
                    id: "khName",
                    label: "គោត្តនាម/នាម",
                    type: "text",
                    required: true,
                  },
                  {
                    id: "engName",
                    label: "អក្សរឡាតាំង",
                    type: "text",
                    required: true,
                  },
                  { id: "height", label: "កម្ពស់", type: "text" },
                  { id: "weight", label: "ទម្ងន់", type: "text" },
                  { id: "bod", label: "ថ្ងៃខែឆ្នាំកំណើត", type: "date" },
                  // { id: 'birthdateAddress', label: 'ទីកន្លែងកំណើត', type: 'text' },
                  {
                    id: "currentAddress",
                    label: "អាស័យដ្ឋានបច្ចុប្បន្ន",
                    type: "text",
                  },
                  // { id: 'phoneNumber1', label: 'លេខទូរសព្ទ', type: 'text' },
                  // { id: 'email', label: 'អ៊ីម៉ែល', type: 'email' },
                  // { id: 'specailPhoneNumber', label: 'លេខទូរសព្ទក្រុមហ៊ុន', type: 'text' }
                ].map(({ id, label, type, options }) => (
                  <div key={id} className="flex flex-col gap-2">
                    <label
                      htmlFor={id}
                      className="flex gap-1 text-sm font-medium text-gray-700"
                    >
                      {errors[id] && <p className="text-sm text-red-600">*</p>}
                      {label}
                    </label>
                    {type === "date" ? (
                      <DatePicker
                        id={id}
                        selected={bod}
                        onChange={handleDateChange}
                        className={`block w-full p-2 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1 ${
                          errors[id] ? "border-red-500" : ""
                        }`}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select date"
                        // disabled={disabled}
                        disabled={disabled ? true : undefined}
                      />
                    ) : type === "select" ? (
                      <select
                        id={id}
                        value={formData[id] || ""}
                        onChange={handleChange}
                        className={`block w-full p-3 text-gray-500 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1 ${
                          errors[id] ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Select {label}</option>
                        {options.map((option) => (
                          <option key={option} value={option.toLowerCase()}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        id={id}
                        value={formData[id]}
                        onChange={handleChange}
                        // disabled={disabled}
                        disabled={disabled ? true : undefined}
                        className={`block w-full p-2 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1 ${
                          errors[id] ? "border-red-500" : ""
                        }`}
                      />
                    )}
                    {errors[id] && (
                      <p className="mt-1 text-xs text-red-500">{errors[id]}</p>
                    )}
                  </div>
                ))}

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="genderCode"
                    className="flex gap-1 text-sm font-medium text-gray-70"
                  >
                    {/* {!formData.genderCode && <p className="text-sm text-red-600">*</p>} */}
                    ភេទ
                  </label>
                  <select
                    id="genderCode"
                    value={formData.genderCode}
                    onChange={handleChange}
                    required
                    disabled={disabled ? true : undefined}
                    className="block w-full p-3 text-sm text-gray-500 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1"
                  >
                    <option value="" disabled hidden>
                      Select the Gender
                    </option>
                    <option value="M">ប្រុស</option>
                    <option value="F">ស្រី</option>
                  </select>
                  {/* {!formData.gender && <p className="text-sm text-red-600">This field is required</p>} */}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="department"
                    className="text-sm font-medium text-gray-700"
                  >
                    នាយកដ្ឋាន
                  </label>

                  <Select
                    options={department}
                    onChange={handleDepartmentChange}
                    value={department.find((option) => option.value === formData.departCode)}
                    placeholder="Select Department"
                    className="basic-single"
                    classNamePrefix="select"
                  />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="officeCode" className="text-sm font-medium text-gray-700">
                      ការិយាល័យ
                    </label>
                    <Select
                      options={optionsOffice}
                      onChange={handleOfficeChange}
                      value={optionsOffice.find((option) => option.value === formData.officeCode)}
                      placeholder={loadingOffices ? "Loading..." : "Select Office"}
                      className="basic-single"
                      classNamePrefix="select"
                      isDisabled={optionsOffice.length === 0 || loadingOffices} // Disable if no offices
                    />
                  </div>


                {[
                  { id: "branchCode", label: "សាខា", type: "text" },
                  // { id: 'position', label: 'តួនាទី', type: 'text' }
                ].map(({ id, label, type }) => (
                  <div key={id} className="flex flex-col gap-2">
                    <label
                      htmlFor={id}
                      className="flex gap-1 text-sm font-medium text-gray-700"
                    >
                      {/* {!formData.companyBranchCode && <p className="text-sm text-red-600">*</p>} */}

                      {label}
                    </label>

                    <input
                      type={type}
                      id={id}
                      value={formData[id]}
                      onChange={handleChange}
                      disabled={disabled ? true : undefined}
                      className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1"
                    />
                  </div>
                ))}
                {[
                  {
                    id: "positionCode",
                    label: "តួនាទី",
                    type: "select",
                    options,
                  },
                ].map(({ id, label, type }) => (
                  <div key={id} className="flex flex-col gap-2">
                    {/* Label with red asterisk if positionCode is not selected */}
                    <label
                      htmlFor={id}
                      className="flex gap-1 text-sm font-medium text-gray-700"
                    >
                      {/* {!formData.positionCode && <p className="text-sm text-red-600">*</p>} */}
                      {label}
                    </label>

                    {/* Conditionally rendering select or input based on type */}
                    {type === "select" ? (
                      <Select
                        options={optionsPosiotn}
                        onChange={handlePositionChange} // Ensure handleStaffCode is passed correctly here
                        value={optionsPosiotn.find(
                          (option) => option.value === formData.positionCode
                        )}
                        placeholder="Select or type to search"
                        className="basic-single"
                        classNamePrefix="select"
                        isDisabled={disabled}
                        styles={customStyles}
                      />
                    ) : (
                      <input
                        type={type}
                        id={id}
                        value={formData[id] || ""}
                        onChange={handleChange}
                        disabled={disabled ? true : undefined}
                        className="block w-full p-2 border border-gray-300 shadow-sm outline-none rounded-xl focus:ring-primary-500 focus:border-primary-500"
                      />
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="fileUpload"
                    className="flex gap-1 text-sm font-medium text-gray-700"
                  >
                    រូបភាព
                  </label>
                  <input
                    type="file"
                    id="fileUpload"
                    onChange={handleChange}
                    disabled={disabled ? true : undefined}
                    className="block w-full text-sm border border-gray-300 rounded-lg shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 disabled:opacity-50 disabled:pointer-events-none text-neutral-400 file:border-0 file:me-4 file:py-3 file:px-4 file:bg-blue-600 file:text-white"
                  />
                  {errors.fileUpload && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fileUpload}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-5 p-6 mt-12">
                <button
                  type="submit"
                  onClick={saveAllModal}
                  className="px-8 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                >
                  <p className="text-base font-normal">រក្សាទុក</p>
                </button>
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-6 py-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 border-dashed rounded-lg shadow-sm hover:bg-gray-100"
                >
                  <p className="text-base font-normal">ចាកចេញ</p>
                </button>
              </div>

              {/* <div className="flex justify-center gap-5 p-6 mt-4">
                                <button
                                  type="submit"
                                  onClick={handleSaveEmployee}
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
            </form>
          </div>
        )}

        {activeTab === "វគ្គសិក្សា" && (
          <div className="">
            <form
              onSubmit={handleFormSubmit}
              className="p-6 space-y-6"
              data-aos="zoom-in"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="staffcode"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Staff Code
                  </label>
                  <Select
                    id="staffcode"
                    options={optionsStaffCode}
                    onChange={handleStaffCode}
                    value={optionsStaffCode.find(
                      (option) => option.value === DataCourse.staffcode
                    )}
                    placeholder="Select or type to search staff code"
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                  {errors.staffcode && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.staffcode}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="staffname"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Staff Name
                  </label>
                  <Select
                    id="staffname"
                    options={optionsStaffName}
                    onChange={handleStaffName}
                    value={optionsStaffName.find(
                      (option) => option.value === DataCourse.staffname
                    )}
                    placeholder="Select or type to search staff name"
                    className="basic-single"
                    classNamePrefix="select"
                    styles={customStyles}
                  />
                  {errors.staffname && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.staffname}
                    </p>
                  )}
                </div>

                {/* From Date Input */}

                <div>
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Course Code
                  </label>
                  <input
                    type="text" // Specify the type of the input field
                    id="courseCode"
                    className="block w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={DataCourse.courseCode}
                    onChange={handleChangeCourse}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium text-gray-800"
                  >
                    វគ្គសិក្សា
                  </label>
                  <input
                    type="text" // Specify the type of the input field
                    id="coursename"
                    className="block w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={DataCourse.coursename}
                    onChange={handleChangeCourse}
                    required
                  />
                </div>
                {/* Organize Dropdown */}
                <div>
                  <label
                    htmlFor="organize"
                    className="block text-sm font-medium text-gray-800"
                  >
                    ក្រុមហ៊ុន
                  </label>
                  <input
                    type="text"
                    id="organize"
                    className="block w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={DataCourse.organize}
                    onChange={handleChangeCourse}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="from"
                    className="block text-sm font-medium text-gray-800"
                  >
                    ចាប់ផ្តើម
                  </label>
                  <input
                    type="date"
                    id="from"
                    className="block w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={DataCourse.from}
                    onChange={handleChangeCourse}
                    required
                  />
                </div>

                {/* To Date Input */}
                <div>
                  <label
                    htmlFor="to"
                    className="block text-sm font-medium text-gray-800"
                  >
                    ដល់
                  </label>
                  <input
                    type="date"
                    id="to"
                    className="block w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={DataCourse.to}
                    onChange={handleChangeCourse}
                    required
                  />
                </div>

                {/* Location and Course Type Radio Buttons Row */}
                <div className="flex flex-col gap-8 md:col-span-2 md:flex-row">
                  {/* Location Radio Buttons */}
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-800">
                      ទីតាំង
                    </label>
                    <div className="flex items-center mt-2 space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="location"
                          checked={newCourse.inCountry}
                          onChange={handleLocationChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-normal text-gray-800">
                          ក្នុងប្រទេស
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="location"
                          checked={!newCourse.outCountry}
                          onChange={() =>
                            setNewCourse((prev) => ({
                              ...prev,
                              inCountry: false,
                            }))
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-800">
                          ក្រៅប្រទេស
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Course Type Radio Buttons */}
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-800">
                      ប្រភេទវគ្គសិក្សា
                    </label>
                    <div className="flex items-center mt-2 space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="courseType"
                          checked={newCourse.longCourse}
                          onChange={() =>
                            setNewCourse((prev) => ({
                              ...prev,
                              longCourse: true,
                            }))
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-normal text-gray-800">
                          វគ្គសិក្សារយៈពេលវែង
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="courseType"
                          checked={!newCourse.longCourse}
                          onChange={() =>
                            setNewCourse((prev) => ({
                              ...prev,
                              longCourse: false,
                            }))
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-800">
                          វគ្គសិក្សារយៈពេលខ្លី
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Last Modified By Input */}
                {/* <div className="md:col-span-2">
                  <label htmlFor="lastBy" className="block text-sm font-semibold text-gray-800">Last Modified By</label>
                  <input
                    type="text"
                    id="lastBy"
                    className="block w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={newCourse.lastBy}
                    onChange={(e) => setNewCourse((prev) => ({ ...prev, lastBy: e.target.value }))}
                    required
                  />
                </div> */}
              </div>

              <div className="flex justify-center gap-5 p-6 mt-12">
                <button
                  type="submit"
                  onClick={saveAllModalCourse}
                  className="px-8 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                >
                  <p className="text-base font-normal">រក្សាទុក</p>
                </button>
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-6 py-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 border-dashed rounded-lg shadow-sm hover:bg-gray-100"
                >
                  <p className="text-base font-normal">ចាកចេញ</p>
                </button>
              </div>
              {/* Form Actions */}
              {/* <div className="flex justify-center gap-5 p-6 mt-4">
                <button
                  type="submit"
                  className="px-8 py-2 text-base font-normal text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                >
                  រក្សាទុក
                </button>
                <button
                  type="button"
                  className="px-6 py-4 text-base font-normal text-gray-700 bg-white border border-gray-300 border-dashed rounded-lg shadow-sm hover:bg-gray-100"
                  onClick={() => setActiveTab('tab1')} // Navigate back to Tab 1
                >
                  បោះបង់
                </button>
              </div> */}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default MenuTab;
