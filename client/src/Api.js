import axios from 'axios'

export const Api = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:5000/api'
})

Api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
