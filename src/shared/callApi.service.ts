import axios from 'axios';
const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    params: {}
});

instance.interceptors.request.use(function (config) {
    const TOKEN = localStorage.getItem('token');
    if (typeof window == 'undefined') {
        return config
    }
    if (TOKEN) {
        config.headers.Authorization = TOKEN;
    }
    return config;
}, function (error) {
    return Promise.reject(error)
})

function logoutAction() {
    localStorage.clear();
    window.location.href = '/login';
}

instance.interceptors.response.use((response) => {
    return response
}, function (error) {
    if (error.response.status === 401) {
        logoutAction();
        return Promise.reject(error);
    }
    return Promise.reject(error);
});


export default instance