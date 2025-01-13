// import request from '../utils/requst.js'
import request from '@/utils/requst'
import axios from 'axios';

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

export function GetEmp(params) {
    console.log(params);
    return request({
        method: "GET",
        url: '/staffs/getSelectEpm',
        params: params
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
export function DeleteUser(id) {
    return request({
        method: 'DELETE', // Assuming the backend uses the DELETE HTTP method
        // url: `/user/deleteUser?username=${username}`, // Add the username to the query parameter
        url: `/user/deleteUser/${id}`
    });
}

export function Login({ username, password }) {
    return request({
        method: 'POST',
        url: '/auth/login.do',
        data: {
            username,
            password,
        }
    });
}

export function DelStaff(id){
    return request({
        method: "DELETE",
        url: `/staff/deleteStaff/${id}`
    })
}

export function UpdateStaff(id, data) {
    return request({
        method: "POST",
        url: `/staff/updateStaff/${id}`,  // Use the Id to construct the URL
        data: data  // Include the data in the request body
    });
}


export function GetMenu(){
    return request({
        method: "GET",
        url: '/menu/getLoginUserMenu'
    })
}

export function Logout(){
    return request({
        method: "POST",
        url: '/auth/logout'
    })
}

export function GetAllUser(){
    return request({
        method: "GET",
        url: '/user/getAllUser'
    })
}

export function AddUser(data) {
    console.log(data);
    return request({
        method: "POST",
        url: '/user/addNewUsers',
        data: data
    });
}

export function UpdateUser(userId, data) {
    return request({
        method: 'POST', // Assuming your API expects a POST request
        url: `/user/updateUser?id=${userId}`, // Use query parameter for user ID
        data: data
    });
}

// Assuming `request` is a function you've defined elsewhere for making HTTP requests
export function uploadPicture(userId, imageFile) {
    // Create a FormData object to hold the file
    const formData = new FormData();
    formData.append('image', imageFile); 

    // Log the form data (optional, can be removed)
    console.log('Uploading image for userId:', userId);

    return request({
        method: "POST",
        url: `/user/${userId}/upload-image`,
        data: formData, 
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });
}

export function GetAllStaff(params){
    console.log(params);
    return request({
        method: "GET",
        url: '/staff/getAllStaff',
        params: params
    });
}

export function AddStaff(data){
    console.log(data);
    return request({
        method: "POST",
        url: '/staff/addNewStaff',
        data: data
    })
}

export function GetOffice(){
    return request({
        method: "GET",
        url: '/Office/getAllOffice',
    })
}



export function GetDep(){
    return request({
        method: "GET",
        url: '/department/findAllDepartment',
    })
}
export function AddOffice(data){
    return request({
        method: "POST",
        url: '/Office/addNewOffice',
        data: data
    })
}

export function UpdateOffice(id, data) {
    return request({
      method: 'POST', // Assuming a POST request is required
      url: `/Office/updateOffice/${id}`, // Use query parameter for the office ID
      data: data
    });
  }
  

export function DeleteOffice(id) {
    return request({
        method: "DELETE",
        url: `/Office/deleteOffice/${id}`,
        
    });
}


export function GetPosition() {
    return request({
        method: "GET",
        url: '/position/getAllPosition',    
    });
}

// export function AddPosition(data) {
//     return request({
//         method: "POST",
//         url: '/position/addNewPosition', 
//         data: data   
//     });
// }


export function AddPosition(data){
    return request({
        method: "POST",
        url: '/position/addNewPosition',
        data: data
    })
}


export function DeletePosition(id) {
    return request({
        method: "DELETE",
        url: `/position/deletePosition/${id}`,
        
    });
}

export function UpdatePosition(id, data) {
    return request({
      method: 'POST', // Assuming a POST request is required
      url: `/position/updatePosition/${id}`, // Use query parameter for the office ID
      data: data
    });
}

export function GetCategory() {
    return request({
        method: "GET",
        url: '/Category/getAllCategory',    
    });
}

export function AddCategory(data){
    return request({
        method: "POST",
        url: '/Category/addNewCategory',
        data: data
    })
}

export function UpdateCategory(id, data) {
    return request({
      method: 'POST', // Assuming a POST request is required
      url: `/Category/updateCategory/${id}`, // Use query parameter for the office ID
      data: data
    });
}

export function DeleteCategory(id) {
    return request({
        method: "DELETE",
        url: `/Category/DeleteCategory/${id}`,
        
    });
}

export function GetSubCategory() {
    return request({
        method: "GET",
        url: '/SubCategory/findAllSubCategory',    
    });
}

export function AddSubCategory(data){
    return request({
        method: "POST",
        url: '/SubCategory/AddNewSubCategory',
        data: data
    })
}

export function UpdateSubCategory(id, data) {
    return request({
      method: 'POST', // Assuming a POST request is required
      url: `/SubCategory/UpdateSubCate/${id}`, // Use query parameter for the office ID
      data: data
    });
}

export function DeleteSubCategory(id) {
    return request({
        method: "DELETE",
        url: `/SubCategory/DeleteSubCate/${id}`,
        
    });
}

export function GetProduct() {
    return request({
        method: "GET",
        url: '/Product/findAllPro',    
    });
}

export function AddProduct(data){
    return request({
        method: "POST",
        url: '/Product/addNewPro',
        data: data
    })
}

export function UpdateProduct(id, data) {
    return request({
      method: 'POST', // Assuming a POST request is required
      url: `/Product/updatePro/${id}`, // Use query parameter for the office ID
      data: data
    });
}

export function DeleteProduct(id) {
    return request({
        method: "DELETE",
        url: `/Product/deletePro/${id}`,
        
    });
}

export function GetAllChild(){
    return request({
        method: "GET",
        url: '/Children/findallchild'
    })
}

export function AddChild(data){
    return request({
        method: "POST",
        url: '/Children/addnewchild',
        data: data
    })
}

export function UpdateChild(id, data) {
    return request({
      method: 'POST', 
      url: `/Children/updateChildById/${id}`, 
      data: data
    });
}

export function DeleteChild(id) {
    return request({
        method: "DELETE",
        url: `/Children/deleteChildById/${id}`,
        
    });
}


export function GetAllwife(){
    return request({
        method: "GET",
        url: '/Wife/findAllWife'
    })
}

export function AddWife(data){
    return request({
        method: "POST",
        url: '/Wife/addNewWife',
        data: data
    })
}

export function UpdateWife(id, data) {
    return request({
      method: 'POST', 
      url: `/Wife/UpdateWifeById/${id}`, 
      data: data
    });
}

export function DeleteWife(id) {
    return request({
        method: "DELETE",
        url: `/Wife/DeleteWifeById/${id}`,
        
    });
}

export function GetAllComputerCourse(){
    return request({
        method: "GET",
        url: '/ComputerCourse/findAllComCourse'
    })
}

export function AddComputerCourse(data){
    return request({
        method: "POST",
        url: '/ComputerCourse/addNewCourse',
        data: data
    })
}

export function UpdateComputerCourse(id, data) {
    return request({
      method: 'POST', 
      url: `/ComputerCourse/updateCourseById/${id}`, 
      data: data
    });
}

export function DeleteComputerCourse(id) {
    return request({
        method: "DELETE",
        url: `/ComputerCourse/deleteComCourseById/${id}`,
        
    });
}

export function AddNewDep(data){
    return request({
        method: "POST",
        url: '/department/AddNewDepart',
        data: data
    })
}

export function DeleteDep(id) {
    return request({
        method: "DELETE",
        url: `/department/DeleteDepart/${id}`,
        
    });
}

export function UpdateDep(id, data) {
    return request({
      method: 'POST', 
      url: `/department/updateDepartment/${id}`, 
      data: data
    });
}

export function GetAllBranch(){
    return request({
        method: "GET",
        url: '/Branch/FindAllBranch'
    })
}

export function AddNewBranch(data){
    return request({
        method: "POST",
        url: '/Branch/addNewBranch',
        data: data
    })
}


export function UpdateBranch(id, data) {
    return request({
      method: 'POST', 
      url: `/Branch/UpdateBranchById/${id}`, 
      data: data
    });
}

export function DeleteBranch(id) {
    return request({
        method: "DELETE",
        url: `/Branch/DeleteBranchById/${id}`,
        
    });
}

export function GetCompany(){
    return request({
        method: "GET",
        url: '/Company/findAllCompany'
    })
}

export function AddNewCompany(data){
    return request({
        method: "POST",
        url: '/Company/AddNewCompany',
        data: data
    })
}

export function UpdateCompany(id, data) {
    return request({
      method: 'POST', 
      url: `/Company/UpdateCompanyById/${id}`, 
      data: data
    });
}


export function DeleteCompany(id) {
    return request({
        method: "DELETE",
        url: `/Company/DeleteCompanyById/${id}`,
        
    });
}

export function GetRole(){
    return request({
        method: "GET",
        url: '/Role/findAllRole'
    })
}

export function AddNewRole(data){
    return request({
        method: "POST",
        url: '/Role/addNewRole',
        data: data
    })
}

export function UpdateRole(id, data) {
    return request({
      method: 'POST', 
      url: `/Role/updateRoleByRoleId/${id}`, 
      data: data
    });
}

export function DeleteRole(id) {
    return request({
        method: "DELETE",
        url: `/Role/deleteRoleByRoleId/${id}`,
        
    });
}

export function AddUserRole(id, roleData){
    console.log('Sending request to add role for user:', id, roleData);
    return request({
        method: "POST",
        url: `/userRole/${id}/assign-roles`,
        data: roleData
        
    })
    
}

export function AddMenuRole(id, roleData){
    console.log('Sending request to add role for user:', id, roleData);
    return request({
        method: "POST",
        url: `/RoleMenu/${id}/menus`,
        data: roleData
        
    })
    
}

export function NewUpdateRole(id, roleData){
    console.log('Sending request to add role for user:', id, roleData);
    return request({
        method: "POST",
        url: `/RoleMenu/${id}/menus`,
        data: roleData
        
    })
    
}

export function ExportUserExcel(){
    return request({
        method: "GET",
        url: '/user/export-users'
    })
}


export function RoleName(username){
    return request({
        method: "GET",
        url: `/user/getRoleName/${username}`
    })
}

