import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { Progress } from '@/types'

// ✅ Use env var with fallback - works in both dev and production
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://roadmap-app-5noa.onrender.com'

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000, // Increased timeout for production
  // ✅ Handle CORS preflight properly
  withCredentials: false
})

// ✅ Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    })
    return Promise.reject(error)
  }
)

export const roadmapApi = {
  async getAllProgress(): Promise<Progress[]> {
    try {
      const response = await api.get<Progress[]>('/progress')
      return response.data
    } catch (error) {
      console.error('Failed to fetch progress:', error)
      throw error
    }
  },

  async saveProgress(itemId: string, completed: boolean): Promise<Progress> {
    try {
      const response = await api.post<Progress>('/progress', { itemId, completed })
      return response.data
    } catch (error) {
      console.error('Failed to save progress:', error)
      throw error
    }
  },

  async resetProgress(): Promise<void> {
    return Promise.resolve()
  }
}

export default api