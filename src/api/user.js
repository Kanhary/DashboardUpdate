// import request from '../utils/requst.js'
import request from '@/utils/requst'
import axios from 'axios';

export function AddUser(data) {
    console.log(data);
    return request({
        method: "POST",
        url: '/userSystem/addUser',
        data: data
    });
}


export function GetUser() {  
    return request({
        method: "GET",
        url: `/user/getLoginUser.do`, 
    });
}

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

export function UpdateUser(ID, data) {
    return request({
        method: 'POST',
        url: `/userSystem/updateUser/${ID}`,
        data: data
    });
}

export function CheckUser(data) {
    return request({
        method: 'POST',
        url: '/userSystem/checkusers',
        data: data,
        // headers: {
        //     'Content-Type': 'multipart/form-data'
        // }
    });
}
export function DeleteUser(ID) {
    return request({
        method: 'POST',
        url: `/userSystem/delete/${ID}`,
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

export function GetAllStaff(params){
    console.log(params);
    return request({
        method: "GET",
        url: '/staffs/getAllStaff',
        params: params
    });
}

export function AddStaff(data){
    console.log(data);
    return request({
        method: "POST",
        url: '/staffs/AddNew_Staff',
        data: data
    })
}

export function DelStaff(Id){
    return request({
        method: "POST",
        url: `/staffs/staffDel/${Id}`
    })
}

export function UpdateStaff(id, data) {
    return request({
        method: "POST",
        url: `/staffs/updateUser/${id}`,  // Use the Id to construct the URL
        data: data  // Include the data in the request body
    });
}

export function GetUserRole(){
    return request({
        method: "GET",
        url: '',

    })
}

export function GetDep(){
    return request({
        method: "GET",
        url: '',
    })
}

export function GetOffice(){
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