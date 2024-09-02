import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const apiClient = axios.create({
    baseURL: `http://localhost:${process.env.PORT}`,
    headers: {
        'Authorization': `Bearer ${process.env.API_ACCESS_SERVER}` 
    }
});

const addEmail = async ({telegramId, code}) => {
    try {
        const response = await apiClient.post('/task/validate', { telegramId, code })
        return response.data
    } catch (error) {
        return error.response.data
    }
}

export default addEmail