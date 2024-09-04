import { getInfoUser } from "../apis/index.js"



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
const  formatDate = async (dateString) =>  {
    const date = new Date(dateString);

    // Lấy giờ, phút, giây
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    // Lấy ngày, tháng, năm
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getUTCFullYear();

    // Chuyển đổi thành định dạng mong muốn
    return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
}

export default {
    getName,
    getMessage,
    getBaseInfo,
    maHoaEmail,
    checkUser,
    isInteger,
    formatDate,
}