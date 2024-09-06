import { getInfoUser } from "../apis/index.js"

import * as dotenv from 'dotenv'

dotenv.config()


const getName = async (msg) => {
    let firstName = msg.from.first_name || '' 
    let lastName = msg.from.last_name || ''
    return `${firstName} ${lastName}`
}
const getMessage = async (msg) => {
    return msg.text
}
const getBaseInfo = async (msg) => {
    let user = msg.from 
    let telegramId = user.id.toString()
    let username = user.username
    let name = await getName(msg)
    let chatId = msg.chat.id
    let idUser = msg.from.id
    return {telegramId, username, name, chatId, idUser}
}
const isInteger = async (value) => {
    const regex = /^\d+$/; // Chỉ chấp nhận các chữ số nguyên
    return regex.test(value);
}
const maHoaEmail = async (email) => {
    if (!email) {
        return "Không có ❌";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        throw new Error('Invalid email format');
    }

    const [localPart, domain] = email.split('@');
    if (!domain || !localPart) {
        return "Không hợp lệ ❌";
    }

    const [domainName, domainExtension] = domain.split('.');

    if (localPart.length <= 6) {
        return email; // Return the original email if local part is too short to mask
    }

    const visibleStart = localPart.slice(0, 3);
    const visibleEnd = localPart.slice(-3);
    const obscuredPart = '*'.repeat(6); // Always use exactly 6 asterisks

    return `${visibleStart}${obscuredPart}${visibleEnd}@${domainName}.${domainExtension}`;
};


const checkUser = async (msg) => {
    let {telegramId} = await getBaseInfo(msg) 

    let res = await getInfoUser({telegramId})
    return res.data

}
const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Lấy giờ, phút, giây theo múi giờ địa phương
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Lấy ngày, tháng, năm theo múi giờ địa phương
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    // Chuyển đổi thành định dạng mong muốn
    return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
};
const  maskStr = async (str, num) => {
    const endPart = str.slice(str.length - num, str.length); // Lấy 2 ký tự đầu
    const maskedPart = '*'.repeat(str.length - num); // Thay thế phần còn lại bằng dấu sao
    return maskedPart + endPart;
}

const checkUserInGroup = async (bot, idUser)=> {

    try {
        const idGroup = process.env.ID_GROUP
        const chatMember = await bot.getChatMember(idGroup, idUser)
        return { 
            success: true,
            data: chatMember
        }        

    } catch (error) {
        if (error.code == 'ETELEGRAM') {
            return {
                success: false,
            }
        }
        console.log(error.message || error)      
    }
}
export default {
    getName,
    getMessage,
    getBaseInfo,
    maHoaEmail,
    checkUser,
    isInteger,
    formatDate,
    maskStr,
    checkUserInGroup,
}