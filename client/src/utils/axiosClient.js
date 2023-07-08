import axios from "axios";
import {
    KEY_ACCESS_TOKEN,
    getItem,
    removeItem,
    setItem,
} from "./localStorageManager";

export const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_URL,
    withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
    const accessToken = getItem(KEY_ACCESS_TOKEN);
    request.headers["Authorization"] = `Bearer ${accessToken}`;
    return request;
});

axiosClient.interceptors.response.use(async(response) => {
    console.log("my response>>>>", response);
    // setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken);
    const data = response.data;
    if (data.status === "ok") {
        return data;
    }

    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const error = data.error;
    // When refresh token is expired, send user to login
    // if (
    //     statusCode === 401 &&
    //     originalRequest.url ===
    //     `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
    // ) {
    //     removeItem(KEY_ACCESS_TOKEN);
    //     window.location.replace("/login", "_self");
    //     return Promise.reject(error);
    // }

    if (statusCode === 401) {
        originalRequest._retry = false;
        const response = await axios.get(
            `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
        );
        console.log("response form backend>>", response);
        if (response.status === "ok") {
            setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
            originalRequest.headers[
                "Authorization"
            ] = `Bearer ${response.result.accessToken}`;
            return axios(originalRequest);
        } else {
            removeItem(KEY_ACCESS_TOKEN);
            window.location.replace("/login", "_self");
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
});