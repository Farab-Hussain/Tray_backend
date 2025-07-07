import axios from 'axios';
import bcrypt from 'bcryptjs';

const API_URL = 'http://localhost:5050/api/auth'; 

export const loginRequest = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data; 
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
