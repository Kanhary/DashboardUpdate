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

  useEffect(() => {
    const fetchAllStaff = async () => {
      try {
        const response = await GetAllStaff();
        console.log("Response data:", response.data);

        const employeesData = response.data?.data || response.data;
        if (Array.isArray(employeesData)) {
          setEmployees(employeesData);
        } else {
          console.error("Unexpected data format:", employeesData);
          setErrors({ message: "Unexpected API response format" });
        }
      } catch (err) {
        // Log and capture more details about the error
        console.error("Error details:", err.response || err);
        const errorMessage =
          err.response?.data?.message || "An unknown error occurred";
        setErrors({ message: errorMessage });
      }
    };

    const fetchAllDep = async () => {
      try {
        const response = await GetDep();
        console.log(response.data.data);
        setDepartment(response.data.data);
      } catch (err) {
        setErrors({ message: err.message || "An error occurred" });
      }
    };
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
        setEmployees(response.data.data);
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
  }, []);

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

  //   const [employees, setEmployees] = useState([

  //     { id: '1', staffCode: '001', fullName: 'សែម ភក្តី', latanName: 'Sem Pheakdey', gender: 'Male', height: '185cm', weight: '75kg', birthDate: '1990-01-01', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់ស្រះចក, ខណ្ឌឬស្សីកែវ, រាជធានីភ្នំពេញ', address: 'សង្កាត់ស្រះចក, ខណ្ឌឬស្សីកែវ, រាជធានីភ្នំពេញ', phoneNumber1: '0123456789', email: 'sem.pheakdey@example.com', specailPhoneNumber: '010 444 152', familyStatus: 'Single', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS3', departmentCode: 'Administration', officeCode: 'IT Department', positionCode: 'Manager', last_modified_by: 'Admin', last_modified_date: '2024-08-21' },
  //     { id: '2', staffCode: '002', fullName: 'សុជឿន ជ័យនេត', latanName: 'Sokhoeun Chhaynet', gender: 'Female', height: '160cm', weight: '55kg', birthDate: '1985-05-15', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់ដេក, ខណ្ឌភ្នំពេញ, រាជធានីភ្នំពេញ', address: 'សង្កាត់ដេក, ខណ្ឌភ្នំពេញ, រាជធានីភ្នំពេញ', phoneNumber1: '0987654321', email: 'sokhoeun.chhaynet@example.com', specailPhoneNumber: '010 555 123', familyStatus: 'Married', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS4', departmentCode: 'Finance', officeCode: 'Engineering Office', positionCode: 'Senior Analyst', last_modified_by: 'Admin', last_modified_date: '2024-08-21' },
  //     { id: '3', staffCode: '003', fullName: 'អ៊ុំ ម៉េង', latanName: 'Um Meng', gender: 'Male', height: '175cm', weight: '68kg', birthDate: '1988-07-22', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់ទន្លេបត, ខណ្ឌសៀមរាប, រាជធានីសៀមរាប', address: 'សង្កាត់ទន្លេបត, ខណ្ឌសៀមរាប, រាជធានីសៀមរាប', phoneNumber1: '0976543210', email: 'um.meng@example.com', specailPhoneNumber: '010 666 789', familyStatus: 'Single', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS5', departmentCode: 'Technology', officeCode: 'Research Department', positionCode: 'IT Specialist', last_modified_by: 'Admin', last_modified_date: '2024-08-21' },
  //     { id: '4', staffCode: '004', fullName: 'ចន ឃឿន', latanName: 'Chan Khuon', gender: 'Female', height: '170cm', weight: '60kg', birthDate: '1992-03-10', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់ផែន, ខណ្ឌព្រះសីហនុ, រាជធានីព្រះសីហនុ', address: 'សង្កាត់ផែន, ខណ្ឌព្រះសីហនុ, រាជធានីព្រះសីហនុ', phonphoneNumber1e_number: '0934567890', email: 'chan.khuon@example.com', specailPhoneNumber: '010 777 888', familyStatus: 'Divorced', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS6', departmentCode: 'Human Resources', officeCode: 'Administrative Office', positionCode: 'HR Coordinator', last_modified_by: 'Admin', last_modified_date: '2024-08-21' },
  //     { id: '5', staffCode: '005', fullName: 'ម៉ៅ សំរៀន', latanName: 'Mao Somrien', gender: 'Male', height: '180cm', weight: '70kg', birthDate: '1980-11-30', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់បឹងកេងកង, ខណ្ឌចំការមន, រាជធានីភ្នំពេញ', address: 'សង្កាត់បឹងកេងកង, ខណ្ឌចំការមន, រាជធានីភ្នំពេញ', phoneNumber1: '0923456789', email: 'mao.somrien@example.com', specailPhoneNumber: '010 888 999', familyStatus: 'Widowed', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS7', departmentCode: 'Research', officeCode: 'Data Office', positionCode: 'Research Analyst', last_modified_by: 'Admin', last_modified_date: '2024-08-21' },
  //     { id: '6', staffCode: '006', fullName: 'សុខ សុជា', latanName: 'Sok Sochea', gender: 'Male', height: '170cm', weight: '65kg', birthDate: '1995-09-25', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់ឬស្សីកែវ, ខណ្ឌសែនសុខ, រាជធានីភ្នំពេញ', address: 'សង្កាត់ឬស្សីកែវ, ខណ្ឌសែនសុខ, រាជធានីភ្នំពេញ', phoneNumber1: '0956789012', email: 'sok.sochea@example.com', specailPhoneNumber: '010 999 000', familyStatus: 'Single', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS8', departmentCode: 'Logistics', officeCode: 'Administrative Office', positionCode: 'Logistics Manager', last_modified_by: 'Admin', last_modified_date: '2024-08-21' },
  //     { id: '7', staffCode: '007', fullName: 'ម៉ាត់ សុខសម', latanName: 'Mat Soksam', gender: 'Female', height: '162cm', weight: '58kg', birthDate: '1993-12-12', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់បឹងត្របែក, ខណ្ឌកណ្តាល, រាជធានីភ្នំពេញ', address: 'សង្កាត់បឹងត្របែក, ខណ្ឌកណ្តាល, រាជធានីភ្នំពេញ', phoneNumber1: '0965432101', email: 'mat.soksam@example.com', specailPhoneNumber: '010 333 444', familyStatus: 'Married', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS9', departmentCode: 'Customer Service', officeCode: 'Support Office', positionCode: 'Customer Service Representative', last_modified_by: 'Admin', last_modified_date: '2024-08-21' },
  //     { id: '8', staffCode: '008', fullName: 'ឃីម សុវណ្ណ', latanName: 'Kim Sovann', gender: 'Male', height: '178cm', weight: '72kg', birthDate: '1987-06-20', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់បឹងទំពូង, ខណ្ឌពោធិ៍សែនជ័យ, រាជធានីភ្នំពេញ', address: 'សង្កាត់បឹងទំពូង, ខណ្ឌពោធិ៍សែនជ័យ, រាជធានីភ្នំពេញ', phoneNumber1: '0978765432', email: 'kim.sovann@example.com', specailPhoneNumber: '010 222 333', familyStatus: 'Separated', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS10', departmentCode: 'Marketing', officeCode: 'Strategy Office', positionCode: 'Marketing Specialist', last_modified_by: 'Admin', last_modified_date: '2024-08-21' },
  //     { id: '9', staffCode: '009', fullName: 'ទូច ស្រេង', latanName: 'Touch Sreang', gender: 'Female', height: '168cm', weight: '63kg', birthDate: '1991-08-14', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់ជ័យជូរ, ខណ្ឌសែនសុខ, រាជធានីភ្នំពេញ', address: 'សង្កាត់ជ័យជូរ, ខណ្ឌសែនសុខ, រាជធានីភ្នំពេញ', phoneNumber1: '0938765432', email: 'touch.sreang@example.com', specailPhoneNumber: '010 444 555', familyStatus: 'Single', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS11', departmentCode: 'Accounting', officeCode: 'Finance Office', positionCode: 'Accountant', last_modified_by: 'Admin', last_modified_date: '2024-08-21' },
  //     { id: '10', staffCode: '010', fullName: 'គង់ សេង', latanName: 'Kong Seng', gender: 'Male', height: '177cm', weight: '70kg', birthDate: '1982-04-05', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់កំពង់ឃុំ, ខណ្ឌឬស្សីកែវ, រាជធានីភ្នំពេញ', address: 'សង្កាត់កំពង់ឃុំ, ខណ្ឌឬស្សីកែវ, រាជធានីភ្នំពេញ', phoneNumber1: '0945678901', email: 'kong.seng@example.com', specailPhoneNumber: '010 666 000', familyStatus: 'Married', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS12', departmentCode: 'Legal', officeCode: 'Legal Affairs Office', positionCode: 'Legal Advisor', last_modified_by: 'Admin', last_modified_date: '2024-08-21' },
  //     { id: '11', staffCode: '011', fullName: 'អៀង សុផល', latanName: 'Ieang Sophal', gender: 'Female', height: '155cm', weight: '50kg', birthDate: '1990-11-22', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់ជ័យជោគ, ខណ្ឌសែនសុខ, រាជធានីភ្នំពេញ', address: 'សង្កាត់ជ័យជោគ, ខណ្ឌសែនសុខ, រាជធានីភ្នំពេញ', phoneNumber1: '0955432101', email: 'ieang.sophal@example.com', specailPhoneNumber: '010 777 888', familyStatus: 'Single', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS13', departmentCode: 'HR', officeCode: 'Human Resources Office', positionCode: 'HR Coordinator', last_modified_by: 'Admin', last_modified_date: '2024-08-22' },
  //     { id: '12', staffCode: '012', fullName: 'យ៉ែត សំអាង', latanName: 'Yet Somang', gender: 'Male', height: '180cm', weight: '75kg', birthDate: '1984-01-19', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់បឹងកេងកង, ខណ្ឌទួលគោក, រាជធានីភ្នំពេញ', address: 'សង្កាត់បឹងកេងកង, ខណ្ឌទួលគោក, រាជធានីភ្នំពេញ', phoneNumber1: '0967891234', email: 'yet.somang@example.com', specailPhoneNumber: '010 999 000', familyStatus: 'Married', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS14', departmentCode: 'IT', officeCode: 'IT Support Office', positionCode: 'IT Specialist', last_modified_by: 'Admin', last_modified_date: '2024-08-22' },
  //     { id: '13', staffCode: '013', fullName: 'ទេព សុភាព', latanName: 'Teap Sophap', gender: 'Female', height: '160cm', weight: '57kg', birthDate: '1992-07-09', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់ឫស្សីកែវ, ខណ្ឌឫស្សីកែវ, រាជធានីភ្នំពេញ', address: 'សង្កាត់ឫស្សីកែវ, ខណ្ឌឫស្សីកែវ, រាជធានីភ្នំពេញ', phoneNumber1: '0976543210', email: 'teap.sophap@example.com', specailPhoneNumber: '010 888 999', familyStatus: 'Single', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS15', departmentCode: 'R&D', officeCode: 'Research Office', positionCode: 'Research Analyst', last_modified_by: 'Admin', last_modified_date: '2024-08-22' },
  //     { id: '14', staffCode: '014', fullName: 'សេក ប៉ូលី', latanName: 'Sek Polley', gender: 'Male', height: '172cm', weight: '68kg', birthDate: '1986-03-25', nationality: 'Khmer', region: 'Cambodia', birthdateAddress: 'សង្កាត់ស្វាយដល់, ខណ្ឌដង្កោ, រាជធានីភ្នំពេញ', address: 'សង្កាត់ស្វាយដល់, ខណ្ឌដង្កោ, រាជធានីភ្នំពេញ', phoneNumber1: '0939876543', email: 'sek.polley@example.com', specailPhoneNumber: '010 555 666', familyStatus: 'Married', companyCode: 'Phnom Penh Autonomous Port', companyBranchCode: 'TS16', departmentCode: 'Operations', officeCode: 'Operations Office', positionCode: 'Operations Manager', last_modified_by: 'Admin', last_modified_date: '2024-08-22' },

  // ]);

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
        const response = await DelStaff(id);
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
  const handleSaveEmployee = async () => {
    // Ensure formData has the correct structure with all fields
    const updatedFormData = {
      ...formData, // Spread existing form data
      departCode: formData.departCode || "", // Ensure departcode is properly populated
      staffCode: formData.staffCode || "", // Ensure staffcode is set
      engName: formData.engName || "", // Ensure engname is set
      khName: formData.khName || "", // Ensure khname is set
      branchCode: formData.branchCode || "", // Ensure branchCode is set
      positionCode: formData.positionCode || "", // Ensure positioncode is set
      genderCode: formData.genderCode || "", // Ensure gendercode is set
      height: formData.height || null, // Set height if provided
      weight: formData.weight || null, // Set weight if provided
      bod: formData.bod || null, // Set bod (birthday) if provided
      currentAddress: formData.currentAddress || "", // Ensure address is set
      // courseCode: formData.courseCode?.map(course => course.value) || [],
      isRetire: formData.isRetire || false, // Set isretire if provided
      resign: formData.resign || false, // Set resign if provided
      isHoldWork: formData.isHoldWork || false, // Set isholdwork if provided
      photo: formData.photo || null, // If there's a photo, include it; otherwise, null
      createBy: currentUser, // Use the fetched username as creator
      lastBy: currentUser, // Use the fetched username as updater
      lastDate: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    };

    try {
      console.log("Saving employee data:", updatedFormData);
      const response = await AddStaff(updatedFormData);

      if (response.status === 200) {
        console.log("Employee saved successfully:", response);
        Swal.fire({
          title: "Successful",
          text: "Employee created successfully",
          icon: "success",
        });
        // setIsAddModalOpen(false);
        fetchAllStaff();
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

  const handleSaveEdit = async () => {
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
      const response = await UpdateStaff(id, formData);

      if (response.status === 200) {
        console.log("Employee updated successfully:", response.data);
        Swal.fire({
          title: "Successful",
          text: "Employee update successfully",
          icon: "success",
        });
        setIsEditModalOpen(false); 
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

  const handleViewSave = () => {
    setIsViewModalOpen(false);
  };

  const saveAllModal = async () => {
    if (isAddModalOpen) {
      await handleSaveEmployee();
    } else if (isEditModalOpen) {
      await handleSaveEdit();
    } else if (isViewModalOpen) {
      await handleViewSave();
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
    coursename,
    courseCode,
    fromdate,
    todate,
    organize,
    incountry,
    outcountry
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
      coursename,
      courseCode,
      fromdate,
      todate,
      organize,
      incountry,
      outcountry,
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
  const handleSearch = () => {
    let filteredUsers;
    if (searchTerm === "username") {
      filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchTerm === "id") {
      filteredUsers = users.filter((user) =>
        user.id.toString().includes(searchTerm)
      );
    }
    // Handle the display or processing of `filteredUsers`
    console.log(filteredUsers);
  };

  useEffect(() => {
    setFilteredEmployees(
      employees.filter(
        (employee) =>
          (employee.engname || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (employee.staffcode || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (employee.khname || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
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
            <div className="flex flex-wrap items-center justify-end w-full mr-3 space-x-3 md:w-full md:justify-end ">
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
            </div>

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
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-t-2">
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 px-4 py-3 mr-3 bg-gray-100 border-t border-r"
                  >
                    Action
                  </th>
                  <th scope="col" className="px-4 py-3 border-t border-r">
                    NO
                  </th>
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
                    style={{ minWidth: "120px" }}
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
                    className="transition duration-200 ease-in-out transform border border-b-gray-200 hover:bg-indigo-50 "
                  >
                    <td className="sticky left-0 z-10 flex items-center px-4 py-5 bg-white border-r">
                      <input type="checkbox" className="mr-3 action-checkbox" />
                      <FaPen
                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                        onClick={() =>
                          openEditModal(
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

                    <td className="px-4 py-1 border-r">{employee.id}</td>
                    <td className="px-4 py-1 border-r">{employee.staffCode}</td>
                    <td className="px-4 py-1 border-r">{employee.engName}</td>
                    <td className="px-4 py-1 border-r">{employee.khName}</td>
                    <td className="px-4 py-1 border-r">
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
              <TabMenu
                formData={formData}
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
              <TabMenu
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
