import axios from 'axios'

const Api = axios.create({
    baseURL: 'https://quizmaster.vacationvista.cloud/api',
    withCredentials: true,
});

Api.interceptors.request.use(
    (config) => {
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default Api;