import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const apiClient = axios.create({
    baseURL: `http://localhost:${process.env.PORT}`,
    headers: {
        'Authorization': `Bearer ${process.env.API_ACCESS_SERVER}` 
    }
});

const addBankForUser = async ({telegramId, typeBank, nameBank, numberAccountBank}) => {
    try {
        const response = await apiClient.post('users/add-bank', {telegramId, typeBank, nameBank, numberAccountBank})
        return response.data
    } catch (error) {
        return error.response.data
    }
}

export default addBankForUser