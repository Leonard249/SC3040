import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8865'
});

export default apiClient;
