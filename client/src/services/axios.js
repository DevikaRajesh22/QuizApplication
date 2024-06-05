import axios from 'axios'

const Api = axios.create({
    baseURL: 'https://quizmaster.vacationvista.cloud/api',
    withCredentials: true,
});

export default Api;