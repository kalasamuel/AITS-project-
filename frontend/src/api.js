import axios from 'axios';
import { BACKEND_URL } from './config';

export const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});
