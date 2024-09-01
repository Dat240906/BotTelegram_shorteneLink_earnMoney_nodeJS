import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const apiClient = axios.create({
    baseURL: `http://localhost:${process.env.PORT}`,
    headers: {
        'Authorization': `Bearer ${process.env.API_ACCESS_SERVER}` 
    }
});

const signTaskForUser = async ({telegramId}) => {
    try {
        const response = await apiClient.post('/task/sign', { telegramId })
        return response.data
    } catch (error) {
        return error.response.data
    }
}

export default signTaskForUser