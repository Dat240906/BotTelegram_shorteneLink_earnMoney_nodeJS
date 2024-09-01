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
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log('trả về từ addEmail.js %s', error.response.data)
        return error.response.data
    }
}

export default addEmail