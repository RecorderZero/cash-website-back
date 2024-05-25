import axios from 'axios'

export default axios.create({
    baseURL: "http://192.168.1.103:8000",
    headers: {
        "Content-type": "application/json"
    }
})