import React, { useState, useEffect } from "react";
import { GetMenu, GetRole } from "../../api/user"; // Assuming you have these API methods.
import Select from "react-select";

const GroupDetails = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [menus, setMenus] = useState([]);
  const [flattenedMenus, setFlattenedMenus] = useState([]);
  const [roleMenuPermissions, setRoleMenuPermissions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchRolesAndMenus = async () => {
      try {
        const roleResponse = await GetRole();
        if (roleResponse.data.code === 200) {
          setRoles(roleResponse.data.data);
          setSelectedRole(roleResponse.data.data[0]?.id);
        }

        const menuResponse = await GetMenu();
        if (menuResponse.data.code === 200) {
          const menusData = menuResponse.data.data;
          setMenus(menusData);
          setFlattenedMenus(flattenMenus(menusData)); // Flatten menus for pagination
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setRoles([]);
        setMenus([]);
        setFlattenedMenus([]);
      }
    };

    fetchRolesAndMenus();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      const fetchRolePermissions = async () => {
        try {
          const rolePermissions = [
            { menuId: 1, enabled: true },
            { menuId: 2, enabled: true },
          ];
          setRoleMenuPermissions(rolePermissions);
        } catch (error) {
          console.error("Error fetching role permissions:", error);
          setRoleMenuPermissions([]);
        }
      };

      fetchRolePermissions();
    }
  }, [selectedRole]);

  const flattenMenus = (menus) => {
    const flattened = [];
    menus.forEach((menu) => {
      flattened.push(menu);
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach((child) => flattened.push({ ...child, isChild: true }));
      }
    });
    return flattened;
  };

  const handleCheckboxChange = (menuId) => {
    const updatedPermissions = roleMenuPermissions.map((permission) =>
      permission.menuId === menuId
        ? { ...permission, enabled: !permission.enabled }
        : permission
    );

    if (!roleMenuPermissions.some((permission) => permission.menuId === menuId)) {
      updatedPermissions.push({ menuId, enabled: true });
    }

    setRoleMenuPermissions(updatedPermissions);
  };

  const translateText = (text) => {
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
    return translations[text.toLowerCase()] || text;
  };

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
    setIsEditing(false);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      background: "#fff",
      borderColor: "#9e9e9e",
      minHeight: "37px",
      height: "37px",
    }),
  };

  const optionRoleCode = roles.map((r) => ({
    value: r.roleId,
    label: `${r.roleId}-${r.roleLabel}`,
  }));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenus = flattenedMenus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(flattenedMenus.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-lg font-bold">Group Details</h2>

      <div className="mb-4">
        <label htmlFor="role-select" className="block text-sm font-medium text-gray-700">
          Select Role:
        </label>
        <Select
          options={optionRoleCode}
          onChange={handleRoleChange}
          value={selectedRole}
          placeholder="Select a role"
          styles={customStyles}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => console.log("Add new menu")}
          className="px-4 py-2 text-white bg-green-500 rounded shadow-sm hover:bg-green-600"
        >
          Add New Menu
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 text-white rounded ${
            isEditing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isEditing ? "Stop Editing" : "Edit Permissions"}
        </button>
      </div>

      <div className="pt-5 mt-5 border-t">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="text-sm text-gray-600 bg-gray-200">
              <th className="px-4 py-2 border">Menu</th>
              <th className="px-4 py-2 text-center border">Enable</th>
            </tr>
          </thead>
          <tbody>
            {currentMenus.map((menu) => (
              <tr
                key={menu.id}
                className={`text-sm text-gray-700 hover:bg-gray-50 ${
                  menu.isChild ? "pl-8" : ""
                }`}
              >
                <td className={`px-4 py-2 border ${menu.isChild ? "pl-8" : ""}`}>
                  {translateText(menu.menuName)}
                </td>
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

        <div className="flex justify-between mt-4">
          <button
            onClick={goToPreviousPage}
            className={`px-4 py-2 text-white bg-blue-500 rounded ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === 1}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fillRule="evenodd" d="M12.293 14.707a1 1 0 01-1.414 0L6.586 10.414a1 1 0 010-1.414l4.293-4.293a1 1 0 011.414 1.414L8.414 10l3.879 3.879a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            className={`px-4 py-2 text-white bg-blue-500 rounded ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === totalPages}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 010-1.414L11.586 10 7.707 6.121a1 1 0 111.414-1.414l4.293 4.293a1 1 010 1.414l-4.293 4.293a1 1 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
