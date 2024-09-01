import * as dotenv from 'dotenv'
import { randomChar } from './codeReward.js'
import axios from 'axios'
dotenv.config()

const createShortLink = async (initial_url) => {
    console.log(process.env.API_TOKEN_SHRINKMEIO)
    let api = 'https://shrinkme.io/api'
    let params = {
        api: process.env.API_TOKEN_SHRINKMEIO,
        alias: `BotKiemTien_${await randomChar(6)}`,
        url: initial_url,
    }
    try {
        const response = await axios.get(api, { params });
        console.log('data:', response.data);
        return response.data; // Hoặc thực hiện hành động khác với dữ liệu
    } catch (error) {
        console.error('Error creating short link:', error.message);
        // Xử lý lỗi hoặc thông báo cho người dùng
        throw error; // Ném lỗi ra ngoài nếu cần
    }

}


export default {
    createShortLink,
}