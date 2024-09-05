import * as dotenv from 'dotenv'
import { randomChar } from './codeReward.js'
import axios from 'axios'
dotenv.config()

const ShrinkMeIo = async (initial_url) => {
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

const yeuMoney = async (initial_url) => {
    console.log(process.env.API_TOKEN_YEUMONEY)
    let api = 'https://yeumoney.com/QL_api.php'
    let params = {
        token: process.env.API_TOKEN_YEUMONEY,
        format: `json`,
        url: initial_url,
    }
    try {
        const response = await axios.get(api, { params });
        return response.data; // Hoặc thực hiện hành động khác với dữ liệu
    } catch (error) {
        console.error('Error creating short link:', error.message);
        // Xử lý lỗi hoặc thông báo cho người dùng
        throw error; // Ném lỗi ra ngoài nếu cần
    }

}

const _8Link = async (initial_url) => {
    console.log(process.env.API_TOKEN_YEUMONEY)
    let api = 'https://partner.8link.io/api/public/gen-shorten-link'
    let params = {
        apikey: process.env.API_TOKEN_8LINK,
        url: initial_url,
    }
    try {
        const response = await axios.get(api, { params });
        return response.data; // Hoặc thực hiện hành động khác với dữ liệu
    } catch (error) {
        console.error('Error creating short link:', error.message);
        // Xử lý lỗi hoặc thông báo cho người dùng
        throw error; // Ném lỗi ra ngoài nếu cần
    }

}

export default {
    ShrinkMeIo,
    yeuMoney,
    _8Link,
}