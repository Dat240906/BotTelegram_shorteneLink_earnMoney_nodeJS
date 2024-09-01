import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const apiClient = axios.create({
    baseURL: `http://localhost:${process.env.PORT}`,
    headers: {
        'Authorization': `Bearer ${process.env.API_ACCESS_SERVER}` 
    }
});

const validateOtpForEmail = async ({telegramId, otp}) => {
    try {
        const response = await apiClient.post('/email/validate', { telegramId, otp })
        return response.data

    } catch (er) {
        console.log(er.response.data)
        return er.response.data
    }
}

export default validateOtpForEmail