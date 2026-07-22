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

Api.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    const status = error && error.response && error.response.status

    if (status === 401 || status === 403) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInFo')
      localStorage.removeItem('password')

      window.dispatchEvent(new Event('auth-change'))

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)
