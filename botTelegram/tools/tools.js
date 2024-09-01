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
export default {
    getName,
    getMessage,
    getBaseInfo,
    maHoaEmail,
    checkUser,
}