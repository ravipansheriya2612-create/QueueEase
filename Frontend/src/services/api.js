import axios from "axios";

const API = axios.create({
    baseURL: "https://queueease-backend-20e9.onrender.com/api"
});

export default API;