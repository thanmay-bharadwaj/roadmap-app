import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { Progress } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'https://roadmap-app-5noa.onrender.com'

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

export const roadmapApi = {
  async getAllProgress(): Promise<Progress[]> {
    const response = await api.get<Progress[]>('/progress')
    return response.data
  },

  async saveProgress(itemId: string, completed: boolean): Promise<Progress> {
    const response = await api.post<Progress>('/progress', { itemId, completed })
    return response.data
  },

  async resetProgress(): Promise<void> {
    // Backend doesn't have a reset endpoint, so we handle this client-side
    // by deleting all items one by one if needed, or just clear local state
    return Promise.resolve()
  }
}

export default api