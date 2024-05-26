import axios from 'axios'

export default axios.create({
    baseURL: "https://192.168.1.103/api/",
    headers: {
        "Content-type": "application/json"
    }
})