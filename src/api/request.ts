import axios from 'axios';

export interface ApiEnvelope<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

export interface ApiListEnvelope<T> {
  items?: T[];
  list?: T[];
  total?: number;
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

request.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default request;
