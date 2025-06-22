import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nexus-backend-8fhy.onrender.com', 
  withCredentials: true,
  headers:{
    'Content-Type': 'application/json',
    Accept:'application/json'
  }
});

export default api;