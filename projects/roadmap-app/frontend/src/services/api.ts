import axios from 'axios'

const api = axios.create({
  baseURL: 'https://roadmap-app-5noa.onrender.com/'
})

export default api
