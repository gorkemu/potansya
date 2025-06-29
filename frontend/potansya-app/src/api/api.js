import axios from 'axios';

const API_URL = 'http://192.168.1.143:5001/api'; 

export const api = axios.create({
  baseURL: API_URL,
});