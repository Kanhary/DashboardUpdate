import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaLaptop, FaUserFriends, FaCog, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { HiChartBar } from "react-icons/hi2";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { GetMenu } from '../../api/user';

const Sidebar = ({ isSidebarOpen }) => {
  const [activeItem, setActiveItem] = useState('');
  const [submenuStates, setSubmenuStates] = useState({});
  const [menuItems, setMenuItems] = useState([]);

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

  const getIconComponent = (iconName) => {
    const iconMap = {
      dashboard: <FaBuilding />,
      computer: <FaLaptop />,
      peoples: <FaUserFriends />,
      setting: <FaCog />,
      report: <HiChartBar />,
      help: <BsFillQuestionCircleFill />
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
                text={item.menuName}
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
                      text={subItem.menuName}
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
