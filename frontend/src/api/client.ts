import axios, { AxiosError } from 'axios'

const API_URL = (import.meta as any).env.VITE_API_URL || ''

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

let isLoggingOut = false

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config

    if (error.response?.status === 401) {
      if (!isLoggingOut) {
        isLoggingOut = true
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }

    // Retry automático para Network Error
    if (!error.response && config) {
      const retries = (config as any).__retryCount || 0
      if (retries < 2) {
        (config as any).__retryCount = retries + 1
        // Aguarda 1 segundo antes de retry
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return api.request(config)
      }
    }

    return Promise.reject(error)
  }
)
