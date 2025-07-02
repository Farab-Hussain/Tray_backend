import axios from 'axios';

const API_URL = 'http://localhost:5050/api/auth'; 

export const loginRequest = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data; 
};
