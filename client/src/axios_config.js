import axios from "axios"

const backend = axios.create({
    withCredentials: false,
    baseURL: "http://localhost:8080"
});

export default backend;