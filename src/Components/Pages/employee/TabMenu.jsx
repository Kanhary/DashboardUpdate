import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import Select from 'react-select';
import { motion, useScroll } from "framer-motion";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GetDep, GetPosition, GetOffice } from '../../../api/user';


const TabMenu = ({
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
  handleDepartmentChange,
  handlePositionChange
  
}) => {
  const [activeTab, setActiveTab] = useState('tab1'); // Track the active tab
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const { scrollYProgress } = useScroll();
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [department, setDepartment] = useState([]);
  const [position, setPosition] = useState([]);
  const [office, setOffice] =([]);

  // const [formData, setFormData] = useState({
  //   department: '',
  //   office: '',
  // });
  // const [formData, setFormData] = useState({
  //   id: '',
  //   code: '',
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
    from: '',
    to: '',
    course: '',
    organize: '',
    inCountry: true,
    lastBy: ''
  });
  
  useEffect(() => {
    const fetchAllDep = async () => {
      try {
        const response = await GetDep();
        console.log(response.data.data); 
        setDepartment(response.data.data);
        
      } catch (err) {
        setErrors({ message: err.message || 'An error occurred' });
      }
    };

    const fetchAllPostition = async () => {
      try{
        const response = await GetPosition();
        console.log(response.data.data);
        setPosition(response.data.data);
      } catch (err) {
        setErrors({ message: err.message || 'An error occurred' });
      }
    }

    // const fetchAllOffice = async () => {
    //   try {
    //     const response = await GetOffice();
    //     console.log(response.data.data); 
    //     setOffice(response.data.data);
        
    //   } catch (err) {
    //     setErrors({ message: err.message || 'An error occurred' });
    //   }
    // };
    
    fetchAllDep();
    fetchAllPostition();
    // fetchAllOffice();
  }, []);

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
  const optionsDepartment = department.map(dep => ({
    value: dep.departCode,
    label: `${dep.departCode} - ${dep.departEngName}`
  }));
  
  // const optionsOffice = office.map(off => ({
  //   value: off.officeCode,
  //   label: `${off.officeCode} - ${off.officeEngName}`
  // }));
  

  const optionsPosiotn = position.map(pos => ({
    value: pos.positionCode,
    label: `${pos.positionCode} - ${pos.positionName}`
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
  const handleOfficeChange = (e) => {
    const selectedOffice = e.target.value;

    // Update form data
    setFormData(prev => ({
      ...prev,
      office: selectedOffice,
    }));
  };
  
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
    setIsDropdownOpen(prev => !prev);
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
        setFileName('');
    }
};

  const handleShowImage = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
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
      maxHeight: '150px', // Limits the dropdown height to 150px
      overflowY: 'auto', // Allows scrolling when content exceeds height
      fontFamily: 'Noto Serif Khmer', // Custom font
      fontSize: '14px', // Adjust the font size as needed
      zIndex: 9999, // Ensures the dropdown appears above other elements
      WebkitOverflowScrolling: 'touch', // Smooth scrolling for touch devices
    }),
    // menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Ensures 
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensures the portal is on top of other elements
    }),
    control: (provided, state) => ({
      ...provided,
      background: '#fff',
      borderColor: '#9e9e9e',
      minHeight: '30px',
      height: '45px',
      boxShadow: state.isFocused ? null : null,
    }),
  };
  const [bod, setBod] = useState(null);

  const handleDateChange = (date) => {
    setBod(date);
    handleChange({ target: { id: 'bod', value: date } });
  };

  // const handleSaveEmployee = () => {
  //   const validationErrors = {};
  
  //   // Define required fields and their respective error messages
  //   if (!formData.code) validationErrors.code = 'Code is required';
  //   if (!formData.fullname) validationErrors.fullname = 'Full Name is required';
  //   if (!formData.lastname) validationErrors.lastname = 'Last Name is required';
  //   if (!formData.gender) validationErrors.gender = 'Gender is required';
  //   if (!formData.family) validationErrors.family = 'Family Status is required';
  //   if (!formData.region) validationErrors.region = 'Region is required';
  //   if (!formData.nation) validationErrors.nation = 'Nation is required';
  //   if (!formData.nationality) validationErrors.nationality = 'Nationality is required';
  //   if (!formData.department) validationErrors.department = 'Department is required';
  //   if (!formData.office) validationErrors.office = 'Office is required';
  //   if (!formData.company) validationErrors.company = 'Company is required';
  //   if (!formData.position) validationErrors.position = 'Position is required';
  
  //   // If validation errors exist, stop and display the errors
  //   if (Object.keys(validationErrors).length > 0) {
  //     console.log('Validation errors:', validationErrors);
  //     setErrors(validationErrors);
  //     return;
  //   }
  
  //   // Handle save logic here
  //   console.log('Saving employee data:', formData);
  //   setIsAddModalOpen(false);
  // };
  const renderContent = () => {
    
    switch (activeTab) {
      
      case 'tab1':
        return <div className="-mb-8">

          <div className='overflow-auto '>
          <form>
              <div className="grid grid-cols-1 gap-6 px-8 py-2 mt-4 sm:grid-cols-2"
              data-aos='zoom-in'>
              {[
        { id: 'staffCode', label: 'អត្ថលេខ', type: 'text', required: true },
        { id: 'engName', label: 'គោត្តនាម/នាម', type: 'text', required: true },
        { id: 'khName', label: 'អក្សរឡាតាំង', type: 'text', required: true },
        { id: 'height', label: 'កម្ពស់', type: 'text' },
        { id: 'weight', label: 'ទម្ងន់', type: 'text' },
        { id: 'bod', label: 'ថ្ងៃខែឆ្នាំកំណើត', type: 'date' },
        // { id: 'birthdateAddress', label: 'ទីកន្លែងកំណើត', type: 'text' },
        { id: 'currentAddress', label: 'អាស័យដ្ឋានបច្ចុប្បន្ន', type: 'text' },
        // { id: 'phoneNumber1', label: 'លេខទូរសព្ទ', type: 'text' },
        // { id: 'email', label: 'អ៊ីម៉ែល', type: 'email' },
        // { id: 'specailPhoneNumber', label: 'លេខទូរសព្ទក្រុមហ៊ុន', type: 'text' }
      ].map(({ id, label, type, options }) => (
        <div key={id} className="flex flex-col gap-2">
          <label htmlFor={id} className="flex gap-1 text-sm font-medium text-gray-700">
            {errors[id] && <p className="text-sm text-red-600">*</p>}
            {label}
          </label>
          {type === 'date' ? (
            <DatePicker
              id={id}
              selected={bod}
              onChange={handleDateChange}
              className={`block w-full p-2 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1 ${errors[id] ? 'border-red-500' : ''}`}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date"
              // disabled={disabled}
              disabled={disabled ? true : undefined}
            />
          ) : type === 'select' ? (
            <select
              id={id}
              value={formData[id] || ''}
              onChange={handleChange}
              className={`block w-full p-3 text-gray-500 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1 ${errors[id] ? 'border-red-500' : ''}`}
            >
              <option value="">Select {label}</option>
              {options.map(option => (
                <option key={option} value={option.toLowerCase()}>{option}</option>
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
              className={`block w-full p-2 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1 ${errors[id] ? 'border-red-500' : ''}`}
            />
          )}
          {errors[id] && <p className="mt-1 text-xs text-red-500">{errors[id]}</p>}
        </div>
      ))}
                  
                <div className="flex flex-col gap-2">
                  <label htmlFor="genderCode" className="flex gap-1 text-sm font-medium text-gray-70">
                    {/* {!formData.genderCode && <p className="text-sm text-red-600">*</p>} */}
                    ភេទ</label>
                  <select
                    id="genderCode"
                    value={formData.genderCode}
                    onChange={handleChange}
                    required
                    disabled={disabled ? true : undefined}
                    className="block w-full p-3 text-sm text-gray-500 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1"
                  >
                    <option value="" disabled hidden>Select the Gender</option>
                    <option value="M">ប្រុស</option>
                    <option value="F">ស្រី</option>
                  </select>
                  {/* {!formData.gender && <p className="text-sm text-red-600">This field is required</p>} */}
                </div>

                {/* <div className="flex flex-col gap-2">
                  <label htmlFor="familyStatus" className="flex gap-1 text-sm font-medium text-gray-700">
                    {!formData.familyStatus && <p className="text-sm text-red-600">*</p>}
                    ស្ថានភាពគ្រួសារ
                  </label>
                  <select
                    id="familyStatus"
                    value={formData.familyStatus}
                    onChange={handleChange}
                    required
                    disabled={disabled ? true : undefined}
                    className="block w-full p-3 text-sm text-gray-500 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1"
                  >
                    <option value="" disabled hidden>Select the status</option>
                    <option value="single">លីវ</option> 
                    <option value="married">មានគូរ</option> 
                  </select>
                </div> */}
               {/* <div className="flex flex-col gap-2">
                  <label htmlFor="region" className="flex gap-1 text-sm font-medium text-gray-700">
                    {!formData.region && <p className="text-sm text-red-600">*</p>}
                    ប្រទេស</label>
                  <select
                    id="region"
                    value={formData.region }
                    onChange={handleChange}
                    required
                    disabled={disabled ? true : undefined}
                    className="block w-full p-3 text-sm text-gray-500 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1"
                  >
                    <option value="" disabled hidden>Select the region</option>
                    <option value="កម្ពុជា">កម្ពុជា</option>
                    <option value="ថៃ">ថៃ</option>
                    <option value="វៀតណាម">វៀតណាម</option>
                  
                  </select>
                </div> */}

                {/* <div className="flex flex-col gap-2">
                  <label htmlFor="nationals" className="flex gap-1 text-sm font-medium text-gray-700">
                    {!formData.nationals && <p className="text-sm text-red-600">*</p>}
                    ជនជាតិ</label>
                  <input
                    type="text"
                    id="nationals"
                    value={formData.nationals}
                    onChange={handleChange}
                    disabled={disabled ? true : undefined}
                    className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1"
                  />
                </div>   */}
                
                {/* <div className="flex flex-col gap-2">
                  <label htmlFor="nationality" className="flex gap-1 text-sm font-medium text-gray-700">
                    {!formData.nationality && <p className="text-sm text-red-600">*</p>}
                    សញ្ជាតិ</label>
                  <input
                    type="text"
                    id="nationality"
                    value={formData.nationality }
                    onChange={handleChange}
                    disabled={disabled ? true : undefined}
                    className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1"
                  />
                </div> */}

                <div className="flex flex-col gap-2">
        <label htmlFor="department" className="text-sm font-medium text-gray-700">
          នាយកដ្ឋាន
        </label>
        {/* <select
          id="departCode"
          value={formData.departCode}
          onChange={handleDepartmentChange}
          className="block w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-lg"
        >
          <option value="" disable hidden>Select Department</option>
          {department.map(dept => (
            <option key={dept.departCode} value={dept.departCode}>{dept.departEngName}</option>
          ))}
        </select> */}

        <Select
                      options={optionsDepartment}
                      onChange={handleDepartmentChange}  // Ensure handleStaffCode is passed correctly here
                      value={optionsDepartment.find(option => option.value === formData.departCode)}
                      placeholder="Select or type to search"
                      className="basic-single"
                      classNamePrefix="select"
                      isDisabled={disabled}
                      styles={customStyles}
                    />
      </div>

      {/* Office Dropdown */}
      {/* <div className="flex flex-col gap-2">
        <label htmlFor="office" className="text-sm font-medium text-gray-700">
          ការិយាល័យ
        </label>
        <select
          id="office"
          value={formData.office}
          onChange={handleOfficeChange}
          className="block w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-lg"
          disabled={!filteredOffices.length} // Disable if no offices available
        >
          <option value="" disable hidden>Select Office</option>
          {filteredOffices.map((office, index) => (
            <option key={index} value={office}>{office}</option>
          ))}
        </select>
      </div> */}

                {/* {[
                  { id: 'companyCode', label: 'ក្រុមហ៊ុន', type: 'text' },
                  { id: 'position', label: 'តួនាទី', type: 'text' }
                ].map(({ id, label, type }) => (
                  <div key={id} className="flex flex-col gap-2">
                    <label htmlFor={id} className="flex gap-1 text-sm font-medium text-gray-700">
                      {!formData.companyCode &&. <p className="text-sm text-red-600">*</p>}
                      {label}</label>
                    
                    <input
                      type={type}
                      id={id}
                      value={formData[id]}
                      onChange={handleChange}
                      disabled={disabled ? true : undefined}
                      className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-primary-500 focus:border-primary-500 focus:ring-1"
                    />
                  </div>
                ))} */}

                 {[
                  { id: 'branchCode', label: 'សាខា', type: 'text' },
                  // { id: 'position', label: 'តួនាទី', type: 'text' }
                ].map(({ id, label, type }) => (
                  <div key={id} className="flex flex-col gap-2">
                    <label htmlFor={id} className="flex gap-1 text-sm font-medium text-gray-700">
                      {/* {!formData.companyBranchCode && <p className="text-sm text-red-600">*</p>} */}
                    
                    {label}</label>
                    
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

{
  [
    { id: 'positionCode', label: 'តួនាទី', type: 'select', options }
  ].map(({ id, label, type }) => (
    <div key={id} className="flex flex-col gap-2">
      {/* Label with red asterisk if positionCode is not selected */}
      <label htmlFor={id} className="flex gap-1 text-sm font-medium text-gray-700">
        {/* {!formData.positionCode && <p className="text-sm text-red-600">*</p>} */}
        {label}
      </label>

      {/* Conditionally rendering select or input based on type */}
      {type === 'select' ? (
        // <Select
        //   id={id}
        //   options={options}
        //   value={options.find(option => option.value === formData[id])}
        //   onChange={(selectedOption) =>
        //     handleChange({ target: { id, value: selectedOption.value } })
        //   }
        //   isDisabled={disabled}
        //   styles={customStyles} // Custom styles applied to Select
        //   menuPortalTarget={document.body} // Renders dropdown at body level to avoid positioning issues
        //   menuPosition="fixed" // Fixed position to prevent clipping inside other elements
        //   className="block w-full text-sm"
        //   placeholder="Search or select a position"
        //   maxMenuHeight={150} // Limits dropdown height to 150px and allows scrolling
        // />
        <Select
                      options={optionsPosiotn}
                      onChange={handlePositionChange}  // Ensure handleStaffCode is passed correctly here
                      value={optionsPosiotn.find(option => option.value === formData.positionCode)}
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
          value={formData[id] || ''}
          onChange={handleChange}
          disabled={disabled ? true : undefined}
          className="block w-full p-2 border border-gray-300 shadow-sm outline-none rounded-xl focus:ring-primary-500 focus:border-primary-500"
        />
      )}
    </div>
  ))
}
              <div className="flex flex-col gap-2">
                  <label htmlFor="fileUpload" className="flex gap-1 text-sm font-medium text-gray-700">
                    រូបភាព
                  </label>
                  <input
                    type="file"
                    id="fileUpload"
                    onChange={handleChange}
                    disabled={disabled ? true : undefined}
                    className="block w-full text-sm border border-gray-300 rounded-lg shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 disabled:opacity-50 disabled:pointer-events-none text-neutral-400 file:border-0 file:me-4 file:py-3 file:px-4 file:bg-blue-600 file:text-white"
                  />
                  {errors.fileUpload && <p className="mt-1 text-xs text-red-500">{errors.fileUpload}</p>}
              </div>
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
        </div>;

      case 'tab2':
        return (
          <div className="">
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6" data-aos='zoom-in'>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* From Date Input */}
                <div>
                  <label htmlFor="from" className="block text-sm font-medium text-gray-800">ចាប់ផ្តើម</label>
                  <input
                    type="date"
                    id="from"
                    className="block w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={newCourse.from}
                    onChange={(e) => setNewCourse((prev) => ({ ...prev, from: e.target.value }))}
                    required
                  />
                </div>
                
                {/* To Date Input */}
                <div>
                  <label htmlFor="to" className="block text-sm font-medium text-gray-800">ដល់</label>
                  <input
                    type="date"
                    id="to"
                    className="block w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={newCourse.to}
                    onChange={(e) => setNewCourse((prev) => ({ ...prev, to: e.target.value }))}
                    required
                  />
                </div>

                {/* Course Dropdown */}
                <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-800">
                      វគ្គសិក្សា
                    </label>
                    <input
                      type="text"  // Specify the type of the input field
                      id="course"
                      className="block w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={newCourse.course}
                      onChange={(e) => setNewCourse((prev) => ({ ...prev, course: e.target.value }))}
                      required
                    />
                </div>


                  {/* Organize Dropdown */}
                  <div>
                    <label htmlFor="organize" className="block text-sm font-medium text-gray-800">ក្រុមហ៊ុន</label>
                    <input
                      type="text"
                      id="organize"
                      className="block w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={newCourse.organize}
                      onChange={(e) => setNewCourse((prev) => ({ ...prev, organize: e.target.value }))}
                      required
                    />
                  </div>


                {/* Location and Course Type Radio Buttons Row */}
                <div className="flex flex-col gap-8 md:col-span-2 md:flex-row">
                  {/* Location Radio Buttons */}
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-800">ទីតាំង</label>
                    <div className="flex items-center mt-2 space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="location"
                          checked={newCourse.inCountry}
                          onChange={() => setNewCourse((prev) => ({ ...prev, inCountry: true }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-normal text-gray-800">ក្នុងប្រទេស</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="location"
                          checked={!newCourse.outCountry}
                          onChange={() => setNewCourse((prev) => ({ ...prev, inCountry: false }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-800">ក្រៅប្រទេស</span>
                      </label>
                    </div>
                  </div>

                      {/* Course Type Radio Buttons */}
                      <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-800">ប្រភេទវគ្គសិក្សា</label>
                        <div className="flex items-center mt-2 space-x-6">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="courseType"
                              checked={newCourse.longCourse}
                              onChange={() => setNewCourse((prev) => ({ ...prev, longCourse: true }))}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm font-normal text-gray-800">វគ្គសិក្សារយៈពេលវែង</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="courseType"
                              checked={!newCourse.longCourse}
                              onChange={() => setNewCourse((prev) => ({ ...prev, longCourse: false }))}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-800">វគ្គសិក្សារយៈពេលខ្លី</span>
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
        );
      case 'tab3':
        return <div className="p-4 -mb-8">Content for Tab 3</div>;
      default:
        return <div className="p-4 -mb-8">Default Content</div>;
    }
  };

  return (
        <div className="relative"
        data-aos='zoom-in-up duration-1000'>
              {/* Dropdown Menu for Small Screens */}
              <div className="md:hidden sticky top-[75px] z-50">
                <button
                  onClick={handleDropdownToggle}
                  className="flex items-center justify-between px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 ml-3 border border-gray-300 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <span>
                    {activeTab === 'tab1' && 'បញ្ចូលព័ត៌មានបុគ្គលិក'}
                    {activeTab === 'tab2' && 'បញ្ចូលវគ្គសិក្សា'}
                    {activeTab === 'tab3' && 'បញ្ចូលវគ្គសិក្សារយៈពេលខ្លី'}
                  </span>
                  <svg className="w-4 h-4 ml-2 text-blue-800 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isDropdownOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="flex justify-center w-48 mt-1 ml-3 bg-white border border-gray-300 rounded-lg ">
                    <div className="px-2 py-2 font-normal">
                      <button
                        className={`block px-3 py-1 text-sm font-medium  text-left ${activeTab === 'tab1' ? 'bg-blue-100 text-blue-600 rounded-lg' : 'text-gray-700 hover:bg-blue-100 rounded-lg'}`}
                        onClick={() => handleTabChange('tab1')}
                      >
                        បញ្ចូលព័ត៌មានបុគ្គលិក
                      </button>
                      <button
                        className={`block px-3 py-1 text-sm font-medium text-left ${activeTab === 'tab2' ? 'bg-blue-100 text-blue-600 rounded-lg' : 'text-gray-700 hover:bg-blue-100 rounded-lg'}`}
                        onClick={() => handleTabChange('tab2')}
                      >
                        បញ្ចូលវគ្គសិក្សា
                      </button>
                      {/* <button
                        className={`block px-3 py-1 text-sm font-medium text-left ${activeTab === 'tab3' ? 'bg-blue-100 text-blue-600 rounded-lg' : 'text-gray-700 hover:bg-blue-100 rounded-lg'}`}
                        onClick={() => handleTabChange('tab3')}
                      >
                        បញ្ចូលវគ្គសិក្សារយៈពេលខ្លី
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs for Larger Screens */}
              <div className="hidden md:flex top-[70px] z-50 transition-all ease-in-out overflow-x-auto mt-3 w-full scroll-smooth bg-white sticky py-4">
                <button
                  className={`px-4 py-2 font-medium text-sm sm:text-sm md:text-sm flex-grow sm:flex-grow-0 sm:px-6 ${activeTab === 'tab1' ? 'text-blue-800' : 'text-black'}`}
                  onClick={() => handleTabChange('tab1')}
                >
                  បញ្ចូលព័ត៌មានបុគ្គលិក
                  <span
                    className={`block h-[2px] mt-2 transition-all duration-300 ${activeTab === 'tab1' ? 'w-full bg-gradient-to-r from-blue-800 to-blue-600' : 'w-0 bg-transparent'}`}
                    style={{ borderRadius: '9999px' }}
                  />
                </button>
                <button
                  className={`px-4 py-2 font-medium text-xs sm:text-sm md:text-sm flex-grow sm:flex-grow-0 sm:px-6 ${activeTab === 'tab2' ? 'text-blue-800' : 'text-black'}`}
                  onClick={() => handleTabChange('tab2')}
                >
                  បញ្ចូលវគ្គសិក្សា
                  <span
                    className={`block h-[2px] mt-2 transition-all duration-300 ${activeTab === 'tab2' ? 'w-full bg-gradient-to-r from-blue-800 to-blue-600' : 'w-0 bg-transparent'}`}
                    style={{ borderRadius: '9999px' }}
                  />
                </button>
                {/* <button
                  className={`px-4 py-2 font-medium text-xs sm:text-sm md:text-sm flex-grow sm:flex-grow-0 sm:px-6 ${activeTab === 'tab3' ? 'text-blue-800' : 'text-black'}`}
                  onClick={() => handleTabChange('tab3')}
                >
                  បញ្ចូលវគ្គសិក្សារយៈពេលខ្លី
                  <span
                    className={`block h-[2px] mt-2 transition-all duration-300 ${activeTab === 'tab3' ? 'w-full bg-gradient-to-r from-blue-800 to-blue-600' : 'w-0 bg-transparent'}`}
                    style={{ borderRadius: '9999px' }}
                  />
                </button> */}
              </div>

              {/* Content */}
              <div className="mb-4 ">
                {renderContent()}
              </div>
              <div className="flex justify-center gap-5 p-6 mt-12">
                <button
                  type="submit"
                  onClick={saveAllModal}
                  className="px-8 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                >
                  <p className='text-base font-normal'>រក្សាទុក</p>
                </button>
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-6 py-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 border-dashed rounded-lg shadow-sm hover:bg-gray-100"
                >
                  <p className='text-base font-normal'>ចាកចេញ</p>
                </button>
              </div>
        </div>
  );
};
export default TabMenu;