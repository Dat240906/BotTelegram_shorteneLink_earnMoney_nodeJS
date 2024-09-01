import {
    addEmail,
    getInfoUser,
    sendOtpToEmail,
    validateOtpForEmail,
    changeEmailForUser,
} from '../apis/index.js'
import {tools} from "../tools/index.js"
import {sendMessageDefault} from './sendMessageDefault.js'
import messages from '../storages/messages.js'
import optionsButton from '../storages/options.js'
import {
    states,
    stateUsers,
} from "../storages/states.js"
import showAccount from './showAccount.js'


const validateEmail = async (bot, msg) => {
    let { telegramId, chatId, idUser} = await tools.getBaseInfo(msg)
    let email = msg.text
    let ischeckEmail = await kiemTraEmail(bot, msg)
    if (!ischeckEmail) {return}
    let res_getInfo = await getInfoUser({telegramId})
    console.log(res_getInfo.data.email)
    if (res_getInfo.data.email) {
        await sendOtp(bot, msg)
    }
    let res = await addEmail({telegramId, email})
    console.log(res)
    if (!res.success) {
        if (res.message == 'User đã có email rồi') {
            await sendOtp(bot, msg)
        }
            
        
        //email đã tồn tại trên hệ thống
        return sendMessageDefault(bot, chatId, messages.EmailExist, optionsButton.null )
    }
    stateUsers[idUser] = states.NONE
    return await sendOtp(bot, msg)
}
const validateOtp = async (bot, msg) => {
    let { telegramId, chatId, idUser} = await tools.getBaseInfo(msg)
    let otp = msg.text
    let res = await validateOtpForEmail({telegramId, otp})
    console.log('gửi từ validateEmail.js %s', res)
    if (!res.success) {
        return sendMessageDefault(bot, chatId, messages.wrongOtp, optionsButton.wrongOtp)
    }
    stateUsers[idUser] = states.NONE
    showAccount(bot, msg)
    return sendMessageDefault(bot, chatId, messages.trueOtp, optionsButton.all)
}


const sendOtp = async (bot, msg) => {
    let {telegramId, idUser} = await tools.getBaseInfo(msg)
    // đã có email, Gửi OTP ở đây
    let res = sendOtpToEmail({telegramId})
    stateUsers[idUser] = states.AWAITING_OTP
    return sendMessageDefault(bot, idUser, messages.reqOtp, optionsButton.null)
} 
const kiemTraEmail = async (bot, msg) => {
    let email = msg.text.trim();
    if (email.split(' ').length > 1 || !email.includes("@gmail.com")) {
        sendMessageDefault(bot, msg.chat.id, `        
<b>
Email không hợp lệ, email phải có dạng @gmail.com
[ ví dụ: kiemtienbot@gmail.com ]
       </b>`, optionsButton.null);
        return false;
    }
    return true;
};

const changeEmail = async (bot, msg) => {
    let isCheck = await kiemTraEmail(bot, msg)
    if (!isCheck ) {return}
    let {telegramId, chatId, idUser} = await tools.getBaseInfo(msg) 
    let email = msg.text
    let res = await changeEmailForUser({telegramId, email})
    console.log(res)
    if (res.success) {
        return await sendOtp(bot, msg)
    }
    return sendMessageDefault(bot, chatId, messages.EmailExist, optionsButton.wrongOtp)
}
export  {
    validateEmail,
    validateOtp,
    sendOtp,
    changeEmail
,
}