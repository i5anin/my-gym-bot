import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://api.pf-forum.ru/api/v2/',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});
