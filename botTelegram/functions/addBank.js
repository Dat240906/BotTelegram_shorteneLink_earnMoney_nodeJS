
import {
    addBankForUser,
    getInfoUser
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

const addBank = async (bot, msg) => {
    let {telegramId, chatId, idUser} = await tools.getBaseInfo(msg)
    let text_split = msg.text.trim().split('/')
    if (text_split.length < 3) {
        return sendMessageDefault(bot, chatId, messages.errorAddBank, optionsButton.null);
    }
    let typeBank = text_split[0]
    let numberAccountBank = text_split[1]
    let nameBank = text_split[2].toUpperCase()
    let response = await addBankForUser({telegramId, typeBank, nameBank, numberAccountBank})
    if (!response.success) {
        return sendMessageDefault(bot, chatId, `❌ <b>${response.message}</b>`, optionsButton.all);
    }
    stateUsers[msg.from.id] = states.NONE
    sendMessageDefault(bot, chatId, "✅ Thêm thành công", optionsButton.all) 
    return await showAccount(bot, msg)
}


export default addBank