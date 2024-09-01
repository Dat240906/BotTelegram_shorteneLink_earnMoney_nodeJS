import {
    getInfoUser
} from '../apis/index.js'
import {tools} from "../tools/index.js"
import { 
    sendMessageDefault,
    sendPhoto,

} from './sendMessageDefault.js'
import messages from '../storages/messages.js'
import options from '../storages/options.js'
import optionsButton from '../storages/options.js'



const showAccount = async (bot, msg) => {
    let { telegramId, chatId} = await tools.getBaseInfo(msg)
    let response = await getInfoUser({telegramId})
    if (!response.success) {
        return sendMessageDefault(bot, chatId, messages.accountNotActive, optionsButton.activeAcount)
    }

    let data = response.data
    let validate = data.isActive == false ? "Chưa xác thực ❌" : "Đã xác thực ✅"
    let validateEmail = await tools.maHoaEmail(data.email)
    let context = `

<u>Thông tin tài khoản:</u>

↳ Số dư: <b>${data.balance.toLocaleString()} đ</b>
↳ Tên: <b>${data.name}</b>
↳ TeleGram ID: <b>${data.telegramId}</b>
↳ Username: <b>${data.username}</b>
↳ Email: <b>${validateEmail}</b>
↳ Trạng thái: <b>${validate}</b>
    `
    sendPhoto(bot, chatId, 'https://ps.w.org/simple-user-avatar/assets/icon-256x256.png?rev=2413146', context, options.all)
}

export default showAccount