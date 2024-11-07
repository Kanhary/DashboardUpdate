import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaLaptop, FaUserFriends, FaCog, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { HiChartBar } from "react-icons/hi2";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { GetMenu } from '../../api/user';

const Sidebar = ({ isSidebarOpen }) => {
  const [activeItem, setActiveItem] = useState('');
  const [submenuStates, setSubmenuStates] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  
  // const menuItems = [
  //   { id: 1, menuName: 'dashboard', icon: 'dashboard', path: 'dashboard' },
  //   { id: 2, menuName: 'computer', icon: 'computer', path: 'Computer', children: [
  //     // { id: 21, menuName: 'company_list', path: '/computer/company' },
  //     // { id: 22, menuName: 'maintenance', path: '/computer/maintenance' },
  //   ]},
  //   { id: 3, menuName: 'employee', icon: 'peoples', path: 'employee/positionlist', children: [
  //     { id: 16, menuName: 'positionlist', icon: 'positionlist', path: 'employee/positionlist' },
  //     { id: 16, menuName: 'genderlist', icon: 'genderlist', path: 'employee/genderlist' },
  //     { id: 16, menuName: 'employee_info', icon: 'employee_info', path: 'employee/employeeinfo' },
  //   ] },
  //   { id: 4, menuName: 'company', icon: 'company', path: '', children: [
  //     { id: 21, menuName: 'department', icon: 'department', path: 'company/department' },
  //     { id: 21, menuName: 'branch', icon: 'branch', path: 'company/branch' },
  //     { id: 21, menuName: 'office', icon: 'office', path: 'company/office' },
  //     { id: 21, menuName: 'company', icon: 'company', path: 'company/companylist' },
  //   ]},
  //   { id: 5, menuName: 'system_setting', icon: 'setting', path: '', children: [
  //     { id: 30, menuName: 'user', icon: 'user', path: 'system_setting/user' },
  //     { id: 30, menuName: 'rolemenu', icon: 'rolemenu', path: 'system_setting/rolemenu' },
  //     { id: 30, menuName: 'menu', icon: 'menu', path: 'system_setting/menu' },
  //     { id: 30, menuName: 'role', icon: 'role', path: 'system_setting/role' },
  //   ] },
  //   { id: 6, menuName: 'report', icon: 'report', path: 'report' },
  //   { id: 7, menuName: 'help', icon: 'help', path: 'help' },
  // ];
  
  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchMenuItems = async () => {
      try {
        const response = await GetMenu();
        if (response.data.code === 200) {
          setMenuItems(response.data.data);
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]);
      }
    };

    fetchMenuItems();
  }, []);

  const toggleSubmenu = (id) => {
    setSubmenuStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLinkClick = (itemName) => {
    setActiveItem(itemName);
  };

  // Mapping English to Khmer text
  const translations = {
    'dashboard': "ផ្ទាំងគ្រប់គ្រង",
    'computer': "តារាងទិន្នន័យកុំព្យូទ័រ",
    'employee': "តារាងបុគ្គលិក",
    'positionlist': "តារាងបញ្ជីមុខតំណែង",
    'genderlist': "តារាងបញ្ជីភេទបុគ្គលិក",
    'employee_info': "តារាងបញ្ចូលព័ត៌មានបុគ្គលិក",
    'system_setting': "ការកំណត់ប្រព័ន្ធ",
    'setting': "ការកំណត់",
    'report': "របាយការណ៍",
    'help': "ជំនួយ",
    'user': "អ្នកប្រើប្រាស់",
    'company': "តារាងក្រុមហ៊ុន",
    'office' : "ការិយាល័យ",
    'branch' : "សាខា",
    'department' : "នាយកដ្ឋាន",
    'company_list' : "ក្រុមហ៊ុន",
    'maintenance' : "ការថែទាំ",
    'rolemenu': "Role Menu",
    'menu': "Menu",
    'role': "Role"
  };

  // Function to translate menu name
  const translateText = (text) => translations[text.toLowerCase()] || text;

  const getIconComponent = (iconName) => {
    const iconMap = {
      dashboard: <MdDashboard />,
      computer: <FaLaptop />,
      peoples: <FaUserFriends />,
      setting: <FaCog />,
      report: <HiChartBar />,
      help: <BsFillQuestionCircleFill />,
      maintenance: <FaScrewdriverWrench/>
    };
    return iconMap[iconName] || <FaBuilding />;  // Default to FaBuilding if icon is not found
  };

  return (
    <aside className={`fixed left-0 top-0 h-full bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-lg transition-transform z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64`}>
      <nav className="flex flex-col h-full overflow-y-auto" data-aos='fade-right' data-aos-delay='200'>
        <ul className="flex flex-col px-3 mt-20 space-y-1 font-khmer">
          {menuItems.map((item) => (
            <div key={item.id}>
              <NavItem
                icon={getIconComponent(item.icon)}
                text={translateText(item.menuName)} 
                onClick={() => toggleSubmenu(item.id)}
                isActive={activeItem === item.menuName}
                dropdownIcon={item.children && item.children.length > 0 ? (submenuStates[item.id] ? <FaChevronUp /> : <FaChevronDown />) : null}  // Show dropdown icon only if there are children
                to={item.path}
              />
              {item.children && submenuStates[item.id] && (
                <ul className="pl-4">
                  {item.children.map((subItem) => (
                    <SubmenuItem
                      key={subItem.id}
                      text={translateText(subItem.menuName)} 
                      to={subItem.path}
                      onClick={() => handleLinkClick(subItem.menuName)}
                      isActive={activeItem === subItem.menuName}
                    />
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const NavItem = ({ icon, text, onClick, to, isActive, dropdownIcon }) => {
  return (
    <li className={`flex items-center justify-between px-4 py-3 transition-colors duration-200 cursor-pointer hover:bg-white/10 rounded-md ${isActive ? 'bg-white/10' : ''}`} onClick={onClick}>
      <Link to={to} className="flex items-center w-full">
        <span className="text-xl">{icon}</span>
        <span className="ml-3 text-base font-normal">{text}</span>
      </Link>
      {dropdownIcon && <span>{dropdownIcon}</span>}  {/* Render dropdownIcon only if it exists */}
    </li>
  );
};

const SubmenuItem = ({ text, to, onClick, isActive }) => {
  return (
    <li className={`flex items-center px-6 py-2 transition-colors duration-200 rounded-md cursor-pointer ${isActive ? 'text-sky-300' : ''}`}>
      <Link to={to} className="w-full text-[13px]" onClick={onClick}>
        {text}
      </Link>
    </li>
  );
};

export default Sidebar;
