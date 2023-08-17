import axios from "axios";

// 'http://router.project-osrm.org/route/v1/driving/79.81039,12.00679;80.28150,13.08195?alternatives=true&geometries=polyline'

export const API_URL = 'http://router.project-osrm.org/route/v1/driving/';

const $api = axios.create({
    baseURL: API_URL,
    timeout: 2000
});

// перехватываем ошибку и если ошибка сетевая, однократно повторняем запрос
$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (!error.config._isRetry && error.code === 'ERR_NETWORK') {
        originalRequest._isRetry = true;
        return $api.request(originalRequest);
    }
    return Promise.reject(error);
});

export default $api;