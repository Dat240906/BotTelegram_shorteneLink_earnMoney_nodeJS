import {
    getDataBank,
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
import { states, stateUsers } from '../storages/states.js'



const showAccount = async (bot, msg) => {
    let { telegramId, chatId} = await tools.getBaseInfo(msg)
    let response = await getInfoUser({telegramId})
    if (!response.success) {
        return sendMessageDefault(bot, chatId, messages.accountNotActive, optionsButton.activeAcount)
    }

    let data = response.data
    let validate = data.isActive == false ? "Chưa xác thực ❌" : "Đã xác thực ✅"
    let validateEmail = await tools.maHoaEmail(data.email)
    let bankUser = await getDataBank({telegramId})
    let infoBank = "Không có ❌"
    if (bankUser.success) {
        let data = bankUser.data
        const typeBank = data.typeBank
        const nameBank = data.nameBank
        const numberAccountBank = data.numberAccountBank
        infoBank = `${typeBank} | ${numberAccountBank} | ${nameBank}`
    }
    let context = `

<u>Thông tin tài khoản:</u>

↳ Số dư: <b>${data.balance.toLocaleString()} đ</b>
↳ Tên: <b>${data.name}</b>
↳ TeleGram ID: <b>${data.telegramId}</b>
↳ Username: <b>${data.username}</b>
↳ Email: <b>${validateEmail}</b>
↳ Ngân hàng: <b>${infoBank}</b>
↳ Trạng thái: <b>${validate}</b>
    `
    stateUsers[msg.from.id] = states.NONE
    sendPhoto(bot, chatId, 'https://ps.w.org/simple-user-avatar/assets/icon-256x256.png?rev=2413146', context, options.all)
}

export default showAccount