import React, { useState, useEffect } from "react";
import { GetMenu, GetRole } from "../../api/user"; // Include relevant API methods
import Select from "react-select";
import axios from "axios"; // Ensure axios is imported
import { Edit } from "lucide-react";

const GroupDetails = () => {
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState(null);
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
          setRoleId(roleResponse.data.data[0]?.roleId);
        }

        const menuResponse = await GetMenu();
        if (menuResponse.data.code === 200) {
          const menusData = menuResponse.data.data;
          setMenus(menusData);
          setFlattenedMenus(flattenMenus(menusData));
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

  // useEffect(() => {
  //   if (roleId) {
  //     const fetchRolePermissions = async () => {
  //       try {
  //         const apiUrl = `http://192.168.168.4:8759/RoleMenu/menuName/${roleId}`;
  //         const response = await axios.get(apiUrl);
  
  //         if (response.data.code === 200) {
  //           const permissions = response.data.data; // Contains menuName data
  
  //           // Map permissions to menus
  //           const updatedPermissions = flattenedMenus.map((menu) => {
  //             // Check if the menuName exists in the permissions data
  //             const matchedPermission = permissions.some(
  //               (permission) => permission.menuName === menu.menuName,
  //               // (permission) => permission.id === menu.id,
  //             );
  
  //             return {
  //               id: menu.id,
  //               menuName: menu.menuName, // Use menuName for matching
  //               enabled: matchedPermission, // Set enabled if the menuName matches
  //             };
  //           });
  
  //           setRoleMenuPermissions(updatedPermissions); // Update the state
  //         }
  //       } catch (error) {
  //         console.error("Error fetching role permissions:", error);
  //         setRoleMenuPermissions([]);
  //       }
  //     };
  
  //     fetchRolePermissions();
  //   }
  // }, [roleId, flattenedMenus]); 

  useEffect(() => {
  if (roleId) {
    const fetchPermissions = async () => {
      try {
        // Fetch assigned menus
        const menusRes = await axios.get(`http://192.168.168.4:8759/RoleMenu/menuName/${roleId}`);
        // Fetch permission details
        const permsRes = await axios.get(`http://192.168.168.4:8759/RoleMenu/${roleId}/permissions`);

        if (menusRes.data.code === 200 && permsRes.data.code === 200) {
          const assignedMenus = menusRes.data.data; // menuName list
          const detailedPerms = permsRes.data.data; // View, New, Edit, Delete list

          const updatedPermissions = flattenedMenus.map((menu) => {
            const isEnabled = assignedMenus.some((m) => m.menuName === menu.menuName);
            const matched = detailedPerms.find((p) => p.menuId === menu.id);

            return {
              menuId: menu.id,
              menuName: menu.menuName,
              View: matched?.View || false,
              New: matched?.New || false,
              Edit: matched?.Edit || false,
              Delete: matched?.Delete || false,
              enabled: isEnabled, // Optional: use to gray out or hide
            };
          });

          setRoleMenuPermissions(updatedPermissions);
        } else {
          setRoleMenuPermissions([]);
        }
      } catch (error) {
        console.error("Error fetching combined permissions:", error);
        setRoleMenuPermissions([]);
      }
    };

    fetchPermissions();
  }
}, [roleId, flattenedMenus]);

  

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

  const handleCheckboxChange = (menuId, permissionType) => {
    const updatedPermissions = roleMenuPermissions.map((permission) =>
      permission.menuId === menuId
        ? { ...permission, [permissionType]: !permission[permissionType] }
        : permission
    );
  
    setRoleMenuPermissions(updatedPermissions);
  };
  
  

const handleSavePermissions = async () => {
  try {
    const apiUrl = `http://192.168.168.4:8759/RoleMenu/set-permission`;

    // Filter out only the permissions where at least one checkbox is true
    const filteredPermissions = roleMenuPermissions.filter(permission =>
      permission.View || permission.New || permission.Edit || permission.Delete
    );

    // Create payload as an array of permission objects
    const payload = filteredPermissions.map(permission => ({
      roleId: roleId,
      menuId: permission.id,
      view: Boolean(permission.View),
      add: Boolean(permission.New),
      edit: Boolean(permission.Edit),
      delete: Boolean(permission.Delete),
    }));

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    await axios.put(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    alert("Permissions updated successfully!");
    setIsEditing(false);
  } catch (error) {
    console.error("Error updating permissions:", error);
    alert("Failed to update permissions. Please try again.");
  }
};

  
  const handleRoleChange = (selectedOption) => {
    setRoleId(selectedOption.value);
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
    label: `${r.roleId}-${r.roleName}`,
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
          value={optionRoleCode.find((option) => option.value === roleId)}
          placeholder="Select a role"
          styles={customStyles}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 text-white rounded ${
            isEditing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isEditing ? "Stop Editing" : "Edit Permissions"}
        </button>
        <button
          onClick={handleSavePermissions}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>

      <div className="pt-5 mt-5 border-t">
        <table className="w-full text-[12px] text-left text-gray-700 border-collapse">
          <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-200 border-b">
            <tr>
              <th className="px-4 py-2 border">Menu</th>
              <th className="px-4 py-2 text-center border">View</th>
              <th className="px-4 py-2 text-center border">Add</th>
              <th className="px-4 py-2 text-center border">Update</th>
              <th className="px-4 py-2 text-center border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentMenus.map((menu) => (
              <tr
              key={menu.id}
              className={`text-[12px] text-gray-700 hover:bg-gray-50 ${menu.isChild ? "pl-8" : ""}`}
            >
              <td className={`px-4 py-2 border ${menu.isChild ? "pl-8" : ""}`}>
                {menu.menuName}
              </td>
            
              {/* View */}
              <td className="px-4 py-2 text-center border">
                <input
                  type="checkbox"
                  className="w-3 h-3 text-blue-600"
                  checked={
                    roleMenuPermissions.find((p) => p.menuId === menu.menuId)?.View || false
                  }
                  onChange={() => isEditing && handleCheckboxChange(menu.menuId, "View")}
                  disabled={!isEditing}
                />
              </td>
            
              {/* Add (New) */}
              <td className="px-4 py-2 text-center border">
                <input
                  type="checkbox"
                  className="w-3 h-3 text-blue-600"
                  checked={
                    roleMenuPermissions.find((p) => p.menuId === menu.menuId)?.New || false
                  }
                  onChange={() => isEditing && handleCheckboxChange(menu.menuId, "New")}
                  disabled={!isEditing}
                />
              </td>
            
              {/* Update (Edit) */}
              <td className="px-4 py-2 text-center border">
                <input
                  type="checkbox"
                  className="w-3 h-3 text-blue-600"
                  checked={
                    roleMenuPermissions.find((p) => p.menuId === menu.menuId)?.Edit || false
                  }
                  onChange={() => isEditing && handleCheckboxChange(menu.menuId, "Edit")}
                  disabled={!isEditing}
                />
              </td>
            
              {/* Delete */}
              <td className="px-4 py-2 text-center border">
                <input
                  type="checkbox"
                  className="w-3 h-3 text-blue-600"
                  checked={
                    roleMenuPermissions.find((p) => p.menuId === menu.menuId)?.Delete || false
                  }
                  onChange={() => isEditing && handleCheckboxChange(menu.menuId, "Delete")}
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
            Previous
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
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
