import axios from "axios"

const backend = axios.create({
    withCredentials: false,
    baseURL: "https://fluent-aileron-232404.ts.r.appspot.com/"
});

export default backend;