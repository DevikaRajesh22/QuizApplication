import axios from 'axios'

const Api = axios.create({baseURL:'https://www.quizmaster.vacationvista.cloud/api',withCredentials:true})

export default Api;