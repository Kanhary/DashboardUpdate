import axios from 'axios';
import { getToken } from './token/Token';

const TOKEN_KEY = 'token'; // Define your token key here

const request = axios.create({
    baseURL: 'http://192.168.168.4:8888',
    withCredentials: false,
    timeout: 30000,
});

// Set default headers
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

request.interceptors.request.use(
    (config) => {
        const token = getToken(TOKEN_KEY);
        console.log("token", token)
        if (token) {
            console.log(token)
            config.headers['Authorization'] = token; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Response interceptor
request.interceptors.response.use(
    (response) => {
        console.log(response.data);
        const { msg = 'Unknown error', code = 500 } = response.data || {};
        console.log("code=====>", code, 'msg====>', msg);
        if (code == null || code === 200) {
            return response;
        }
        return Promise.reject(msg);
    },
    (error) => {
        console.error('Error Response:', error.response);
        return Promise.reject(error);
    }
);

export default request;
