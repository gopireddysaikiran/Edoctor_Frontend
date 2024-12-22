import axios from "axios";

// Create an Axios instance
const api = axios.create({
    baseURL: "http://localhost:8080/api", // Base URL for all backend requests
    timeout: 5000, // Timeout after 5 seconds
});

export default api;