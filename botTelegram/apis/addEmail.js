import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const apiClient = axios.create({
    baseURL: `http://localhost:${process.env.PORT}`,
    headers: {
        'Authorization': `Bearer ${process.env.API_ACCESS_SERVER}` 
    }
});

const addEmail = async ({telegramId, email}) => {
    try {
        const response = await apiClient.post('/users/add-email', { telegramId, email })
        return response.data
    } catch (error) {
        return error.response.data
    }
}

export default addEmail