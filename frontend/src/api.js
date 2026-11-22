import axios from 'axios';

export function getApiErrorMessage(error, fallback) {
  const detail = error?.response?.data?.detail;
  if (detail) return typeof detail === 'string' ? detail : fallback;
  if (!error?.response) {
    return `Tidak dapat menghubungi server API (${api.defaults.baseURL}). Jalankan backend dengan "npm run dev" dari folder utama proyek, atau atur VITE_API_URL jika backend berada di server lain.`;
  }
  return fallback;
}

const api=axios.create({baseURL:import.meta.env.VITE_API_URL || 'http://localhost:8000/api'});
api.interceptors.request.use(config=>{const token=localStorage.getItem('tp_token');if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
export default api;
