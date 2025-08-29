import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nexus-backend-8fhy.onrender.com',// https://nexus-backend-8fhy.onrender.com   //http://localhost:5000
  withCredentials: true,
  headers:{
    'Content-Type': 'application/json',
    Accept:'application/json'
  }
});

export default api;