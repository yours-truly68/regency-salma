import axios from 'axios';

const api = axios.create({ 
  // Assuming standard Express dev port locally
  baseURL: 'http://localhost:3000' 
});

export const authApi = {
  login: async (data: Record<string, string>) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  register: async (data: Record<string, string>) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
};
