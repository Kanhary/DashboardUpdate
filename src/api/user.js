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
export function DeleteUser(username) {
    return request({
        method: 'DELETE', // Assuming the backend uses the DELETE HTTP method
        url: `/user/deleteUser?username=${username}`, // Add the username to the query parameter
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

export function GetUserRole(){
    return request({
        method: "GET",
        url: '',

    })
}




export function GetBranchCode(){
    return request({
        method: "",
        url: '',
    })
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
