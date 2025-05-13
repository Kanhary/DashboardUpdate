// import request from '../utils/requst.js'
import request from "@/utils/requst";
import { data } from "autoprefixer";
import axios from "axios";

// export function GetUser() {
//     return request({
//         method: "GET",
//         url: `/user/getLoginUser.do`,
//     });
// }

export function GetUserLogin() {
  return request({
    method: "GET",
    url: `/user/getLoginUser.do`,
  });
}

export function GetEmp() {
  // console.log(params);
  return request({
    method: "GET",
    url: "/staffs/getSelectEpm",
    // params: params,
  });
}

// export function CheckUser(data) {
//     return request({
//         method: 'POST',
//         url: '/userSystem/checkusers',
//         data: data,
//         // headers: {
//         //     'Content-Type': 'multipart/form-data'
//         // }
//     });
// }

// Modify DeleteUser to accept username as a parameter
export function DeleteUser(id, deleteby) {
  return request({
    method: "DELETE", // Assuming the backend uses the DELETE HTTP method
    // url: `/user/deleteUser?username=${username}`, // Add the username to the query parameter
    url: `/user/deleteUser/${id}`,
    data: {deleteby}
  });
}

export function Login({ username, password }) {
  return request({
    method: "POST",
    url: "/auth/login.do",
    data: {
      username,
      password,
    },
  });
}

export function DelStaff(id) {
  return request({
    method: "DELETE",
    url: `/staff/deleteStaff/${id}`,
  });
}

export function UpdateStaff(data, id) {
  return request({
    method: "POST",
    url: `/staff/updateStaff/${id}`, // Use the Id to construct the URL
    data: data, // Include the data in the request body
  });
}

export function GetMenu() {
  return request({
    method: "GET",
    url: "/menu/getLoginUserMenu",
  });
}

export function Logout() {
  return request({
    method: "POST",
    url: "/auth/logout",
  });
}

export function GetAllUser() {
  return request({
    method: "GET",
    url: "/user/getAllUser",
  });
}

export function AddUser(data) {
  console.log(data);
  return request({
    method: "POST",
    url: "/user/addNewUsers",
    data: data,
  });
}

export function UpdateUser(userId, data) {
  return request({
    method: "POST", // Assuming your API expects a POST request
    url: `/user/updateUser?id=${userId}`, // Use query parameter for user ID
    data: data,
  });
}

// Assuming `request` is a function you've defined elsewhere for making HTTP requests
export function uploadPicture(userId, imageFile) {
  // Create a FormData object to hold the file
  const formData = new FormData();
  formData.append("image", imageFile);

  // Log the form data (optional, can be removed)
  console.log("Uploading image for userId:", userId);

  return request({
    method: "POST",
    url: `/user/${userId}/upload-image`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function GetAllStaff() {
  // console.log(params);
  return request({
    method: "GET",
    url: "/staff/getAllStaff",
    // params: params,
  });
}

export function AddStaff(data) {
  console.log(data);
  return request({
    method: "POST",
    url: "/staff/addNewStaff",
    data: data,
  });
}

export function GetOffice() {
  return request({
    method: "GET",
    url: "/Office/getAllOffice",
  });
}

export function GetDep() {
  return request({
    method: "GET",
    url: "/department/findAllDepartment",
  });
}
export function AddOffice(data) {
  return request({
    method: "POST",
    url: "/Office/addNewOffice",
    data: data,
  });
}

export function UpdateOffice(id, data) {
  return request({
    method: "POST", // Assuming a POST request is required
    url: `/Office/updateOffice/${id}`, // Use query parameter for the office ID
    data: data,
  });
}

export function DeleteOffice(id, deleteby) {
  return request({
    method: "DELETE",
    url: `/Office/deleteOffice/${id}`,
    data: {deleteby}
  });
}

export function GetPosition() {
  return request({
    method: "GET",
    url: "/position/getAllPosition",
  });
}

// export function AddPosition(data) {
//     return request({
//         method: "POST",
//         url: '/position/addNewPosition',
//         data: data
//     });
// }

export function AddPosition(data) {
  return request({
    method: "POST",
    url: "/position/addNewPosition",
    data: data,
  });
}

export function DeletePosition(id, deleteby) {
  return request({
    method: "DELETE",
    url: `/position/deletePosition/${id}`,
    data: {deleteby}
  });
}

export function UpdatePosition(id, data) {
  return request({
    method: "POST", // Assuming a POST request is required
    url: `/position/updatePosition/${id}`, // Use query parameter for the office ID
    data: data,
  });
}

export function GetCategory() {
  return request({
    method: "GET",
    url: "/Category/getAllCategory",
  });
}

export function AddCategory(data) {
  return request({
    method: "POST",
    url: "/Category/addNewCategory",
    data: data,
  });
}

export function UpdateCategory(id, data) {
  return request({
    method: "POST", // Assuming a POST request is required
    url: `/Category/updateCategory/${id}`, // Use query parameter for the office ID
    data: data,
  });
}

export function DeleteCategory(id, deleteby) {
  return request({
    method: "DELETE",
    url: `/Category/DeleteCategory/${id}`,
    data: {deleteby},
  });
}

export function GetSubCategory() {
  return request({
    method: "GET",
    url: "/SubCategory/findAllSubCategory",
  });
}

export function AddSubCategory(data) {
  return request({
    method: "POST",
    url: "/SubCategory/AddNewSubCategory",
    data: data,
  });
}

export function UpdateSubCategory(id, data) {
  return request({
    method: "POST", // Assuming a POST request is required
    url: `/SubCategory/UpdateSubCate/${id}`, // Use query parameter for the office ID
    data: data,
  });
}

export function DeleteSubCategory(id, deleteby) {
  return request({
    method: "DELETE",
    url: `/SubCategory/DeleteSubCate/${id}`,
    data: {deleteby}
  });
}

export function GetProduct() {
  return request({
    method: "GET",
    url: "/Product/findAllPro",
  });
}

export function AddProduct(data, userId) {
  return request({
    method: "POST",
    url: `/Product/addNewPro/${userId}`,
    data: data,
  });
}

export function UpdateProduct(id, data, userId) {
  return request({
    method: "POST", // Assuming a POST request is required
    url: `/Product/updatePro/${id}/${userId}`, // Use query parameter for the office ID
    data: data,
  });
}

export function DeleteProduct(id, deleteby, userId) {
  return request({
    method: "DELETE",
    url: `/Product/productDel/${id}/${userId}`,
    data: { deleteby },
  });
}

export function GetAllChild() {
  return request({
    method: "GET",
    url: "/Children/findallchild",
  });
}

export function AddChild(data) {
  return request({
    method: "POST",
    url: "/Children/addnewchild",
    data: data,
  });
}

export function UpdateChild(id, data) {
  return request({
    method: "POST",
    url: `/Children/updateChildById/${id}`,
    data: data,
  });
}

export function DeleteChild(id, deleteby) {
  return request({
    method: "DELETE",
    url: `/Children/deleteChildById/${id}`,
    data: {deleteby}
  });
}

export function GetAllwife() {
  return request({
    method: "GET",
    url: "/Wife/findAllWife",
  });
}

export function AddWife(data) {
  return request({
    method: "POST",
    url: "/Wife/addNewWife",
    data: data,
  });
}

export function UpdateWife(id, data) {
  return request({
    method: "POST",
    url: `/Wife/UpdateWifeById/${id}`,
    data: data,
  });
}

export function DeleteWife(id, deleteby) {
  return request({
    method: "DELETE",
    url: `/Wife/DeleteWifeById/${id}`,
    data: {deleteby}
  });
}

export function GetAllComputerCourse() {
  return request({
    method: "GET",
    url: "/Course/findAllComCourse",
  });
}

export function AddComputerCourse(data) {
  return request({
    method: "POST",
    url: "/Course/addNewCourse",
    data: data,
  });
}

export function GetComputerCourseById() {
  return request({
    method: "GET",
    url: `/Course/findCourseById/${id}`,
  });
}

export function UpdateComputerCourse(id, data) {
  return request({
    method: "POST",
    url: `/Course/updateCourseById/${id}`,
    data: data,
  });
}

export function DeleteComputerCourse(id, deleteby) {
  return request({
    method: "DELETE",
    url: `/ComputerCourse/deleteComCourseById/${id}`,
    data: {deleteby}
  });
}

export function AddNewDep(data) {
  return request({
    method: "POST",
    url: `/department/addNewDepart`,
    data: data,
  });
}

export function DeleteDep(id, deletedby) {
  return request({
    method: "DELETE",
    url: `/department/DeleteDepart/${id}`,
    data: {deletedby}
  });
}

export function UpdateDep(id, data) {
  return request({
    method: "POST",
    url: `/department/updateDepartment/${id}`,
    data: data,
  });
}

export function GetAllBranch() {
  return request({
    method: "GET",
    url: "/Branch/FindAllBranch",
  });
}

export function AddNewBranch(data, userId) {
  return request({
    method: "POST",
    url: `/Branch/addNewBranch/${userId}`,
    data: data,
  });
}

export function UpdateBranch(id,userId , data) {
  return request({
    method: "POST",
    url: `/Branch/UpdateBranchById/${id}/${userId}`,
    data: data,
  });
}

export function DeleteBranch(id, deleteby) {
  return request({
    method: "DELETE",
    url: `/Branch/DeleteBranchById/${id}`,
    data: {deleteby}
  });
}

export function GetCompany() {
  return request({
    method: "GET",
    url: "/Company/findAllCompany",
  });
}

export function AddNewCompany(data) {
  return request({
    method: "POST",
    url: "/Company/AddNewCompany",
    data: data,
  });
}

export function UpdateCompany(id, data) {
  return request({
    method: "POST",
    url: `/Company/UpdateCompanyById/${id}`,
    data: data,
  });
}

export function DeleteCompany(id, deleteby) {
  return request({
    method: "DELETE",
    url: `/Company/DeleteCompanyById/${id}`,
    data: {deleteby}
  });
}

export function GetRole() {
  return request({
    method: "GET",
    url: "/Role/findAllRole",
  });
}

export function AddNewRole(data, roleName) {
  return request({
    method: "POST",
    url: `/Role/addNewRole/${roleName}`,
    data: data,
  });
}

export function UpdateRole(id, data) {
  return request({
    method: "POST",
    url: `/Role/updateRoleByRoleId/${id}`,
    data: data,
  });
}

export function DeleteRole(id, deleteby) {
  return request({
    method: "DELETE",
    url: `/Role/deleteRoleByRoleId/${id}`,
    data: {deleteby}
  });
}

export function AddUserRole(id, roleData) {
  console.log("Sending request to add role for user:", id, roleData);
  return request({
    method: "POST",
    url: `/userRole/${id}/assign-roles`,
    data: roleData,
  });
}

export function AddMenuRole(id, roleData) {
  console.log("Sending request to add role for user:", id, roleData);
  return request({
    method: "POST",
    url: `/RoleMenu/${id}/menus`,
    data: roleData,
  });
}

export function NewUpdateRole(id, roleData) {
  console.log("Sending request to add role for user:", id, roleData);
  return request({
    method: "POST",
    url: `/RoleMenu/${id}/menus`,
    data: roleData,
  });
}

export function ExportUserExcel() {
  return request({
    method: "GET",
    url: "/user/export-users",
  });
}

export function RoleName(username) {
  return request({
    method: "GET",
    url: `/user/getRoleName/${username}`,
  });
}

export function roleMenuById(roleId) {
  return request({
    method: "GET",
    url: `/RoleMenu/menuName/${roleId}`,
  });
}

export function GetAllComputer() {
    return request({
      method: "GET",
      url: `/Product/totalComputerCount`,
    });
}


export function GetMaintenance() {
  return request({
    method: "GET",
    url: `/Maintenance/getAllMaintenances`,
  });
}

export function AddNewMaintenance(data) {
  return request({
    method: "POST",
    url: "/Maintenance/addNewMaintenance",
    data: data,
  });
}


export function UpdateMaintenance(id, data) {
  return request({
    method: "POST",
    url: `/updateMaintenanceById/${id}`,
    data: data,
  });
}

export function DeleteMaintenance(id, deleteby) {
  return request({
    method: "DELETE",
    url: `/Maintenance/deleteMaintenanceById/${id}`,
    data: {deleteby}
  });
}

export function uploadFile(data) {
  return request({
    method: "POST",
    url: "/Docs/uploadFilePdf",
    data: data,
  });
}


export function GetFile(id) {
  return request({
    method: "GET",
    url: `/Docs/getByMaintenanceId/${id}`,
  });
}

export function GetMaintenanceByID(id) {
  return request({
    method: "POST",
    url: "/Maintenance/getMaintenancesByProductId/id",
    data: data,
  });
}


export function GetOfficeByDep(id) {
  return request({
    method: "GET",
    url: `/Office/selectOfficeFromDepartmentByDepartCode/${id}`,
  });
}

export function ChangePwd(data) {
  return request({
    method: "POST",
    url: "/user/change-password",
    data: data,
  });
}


export function HelpRequest(data) {
  return request({
    method: "POST",
    url: "/helpRequest/request-help",
    data: data,
  });
}


// export function GetOfficeByDep() {
//   return request({
//     method: "GET",
//     url: `/helpRequest/getAllRequest`,
//   });
// }

