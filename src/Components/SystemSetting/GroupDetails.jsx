import React, { useState, useEffect } from "react";
import { GetMenu, GetRole } from "../../api/user"; // Assuming you have these API methods.
import Select from 'react-select';

const GroupDetails = () => {
  const [roles, setRoles] = useState([]); // Stores list of roles.
  const [selectedRole, setSelectedRole] = useState(null); // Stores the currently selected role.
  const [menus, setMenus] = useState([]); // Stores menu data.
  const [roleMenuPermissions, setRoleMenuPermissions] = useState([]); // Stores permissions for the selected role.
  const [isEditing, setIsEditing] = useState(false); // Toggle for editing mode.
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  useEffect(() => {
    const fetchRolesAndMenus = async () => {
      try {
        // Fetch roles
        const roleResponse = await GetRole();
        if (roleResponse.data.code === 200) {
          setRoles(roleResponse.data.data);
          setSelectedRole(roleResponse.data.data[0]?.id); // Set default role
        }

        // Fetch menus
        const menuResponse = await GetMenu();
        if (menuResponse.data.code === 200) {
          setMenus(menuResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setRoles([]);
        setMenus([]);
      }
    };

    fetchRolesAndMenus();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      // Fetch permissions for the selected role when it changes
      const fetchRolePermissions = async () => {
        try {
          // Simulate API call to get role permissions
          const rolePermissions = [
            { menuId: 1, enabled: true },
            { menuId: 2, enabled: false },
            // Add more permissions based on role
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
      // Add more translations as needed
    };
    return translations[text.toLowerCase()] || text;
  };

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
    setIsEditing(false); // Exit edit mode when role changes
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      background: "#fff",
      borderColor: "#9e9e9e",
      minHeight: "37px",
      height: "37px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "37px",
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "37px",
    }),
  };


  const optionRoleCode = roles.map(r => ({
    value: r.roleId,
    label: `${r.roleId}-${r.roleLabel}`
  }))
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenus = menus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(menus.length / itemsPerPage);



  return (
    <div className="mt-10">
      <h2 className="mb-4 text-lg font-bold">Group Details</h2>

      {/* Role Dropdown */}
      <div className="mb-4">
        <label htmlFor="role-select" className="block text-sm font-medium text-gray-700">
          Select Role:
        </label>
        <Select
          options={optionRoleCode}
          onChange={handleRoleChange}
          value={selectedRole}
          placeholder="Select a role"
          className="basic-single"
          classNamePrefix="select"
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

        {/* Editable Mode Toggle */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 text-white rounded ${
            isEditing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isEditing ? "Stop Editing" : "Edit Permissions"}
        </button>
      </div>

      {/* Menu Table */}
      <div className="pt-5 mt-5 border-t">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="text-sm text-gray-600 bg-gray-200">
              <th className="px-4 py-2 border">Menu</th>
              <th className="px-4 py-2 text-center border">Enable</th>
            </tr>
          </thead>
          <tbody>
          {menus && menus.length > 0 ? (
            menus.map((menu) => (
              <React.Fragment key={menu.id}>
                {/* Parent Menu Row */}
                <tr className="text-sm text-gray-700 hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold border">{translateText(menu.menuName)}</td>
                  <td className="px-4 py-2 text-center border">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600"
                      checked={roleMenuPermissions.some(
                        (permission) => permission.menuId === menu.id && permission.enabled
                      )}
                      onChange={() => (isEditing ? handleCheckboxChange(menu.id) : null)}
                      disabled={!isEditing} // Disable checkbox if not in edit mode
                    />
                  </td>
                </tr>

                {/* Children Menus */}
                {menu.children && menu.children.length > 0 && (
                  menu.children.map((child) => (
                    <tr key={child.id} className="text-sm text-gray-600 hover:bg-gray-50">
                      <td className="px-4 py-2 pl-8 border"> {/* Indent child menu */}
                        {translateText(child.menuName)}
                      </td>
                      <td className="px-4 py-2 text-center border">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600"
                          checked={roleMenuPermissions.some(
                            (permission) => permission.menuId === child.id && permission.enabled
                          )}
                          onChange={() => (isEditing ? handleCheckboxChange(child.id) : null)}
                          disabled={!isEditing} // Disable checkbox if not in edit mode
                        />
                      </td>
                    </tr>
                  ))
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="py-4 text-center text-gray-500">
                No menus available.
              </td>
            </tr>
          )}

          </tbody>
        </table>
        
        
      </div>
    </div>
  );
};

export default GroupDetails;
