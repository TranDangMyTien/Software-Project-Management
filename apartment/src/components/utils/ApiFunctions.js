import axios from "axios"
import cookie from "react-cookies";
const BASE_URL="http://192.168.1.11:8000"
export const endpoints = {
    'login': '/o/token/',
    'current-user': '/User/current-user/'
};

export const authAPIs = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': cookie.load("access-token")
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});