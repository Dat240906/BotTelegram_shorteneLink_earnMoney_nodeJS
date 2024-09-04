import axios from "axios"
import * as dotenv from "dotenv"
dotenv.config()
const apiClient = axios.create({
    baseURL: `http://localhost:${process.env.PORT}`,
    headers: {
        'Authorization': `Bearer ${process.env.API_ACCESS_SERVER}` 
    }
});
const createUser = async ({telegramId, username, name}) => {
    try {
        let res = await apiClient.get(`/users/${telegramId}`)
    } catch (error) {
        error.response.data
        try {
            const response = await apiClient.post('/users/register', { telegramId, username, name })
            return true
        }catch (e){
            console.log(e.response.data)
            return false
        }

    }
}



export default createUser
