import {transferMoneyForUser} from "../apis/index.js";
import messages from "../storages/messages.js";
import optionsButton from "../storages/options.js";
import { states, stateUsers } from "../storages/states.js";
import tools from "../tools/tools.js";
import { 
    sendMessageDefault,
} from './sendMessageDefault.js'
import showAccount from "./showAccount.js";
import * as dotenv from "dotenv"
dotenv.config()

const transferMoney = async (bot, msg) => {
    let {telegramId, chatId} = await tools.getBaseInfo(msg)
    let content = msg.text
    let content_cut = content.trim().split(' ') 
    if (content_cut.length != 2) {
        return sendMessageDefault(bot, chatId, messages.errorData, optionsButton.null)
    }
    let telegramIdTarget = content_cut[0]
    let money = content_cut[1]
    let min_transferMoney = process.env.MIN_TRANSFERMONEY

    if (parseInt(money) < parseInt(min_transferMoney)) {
        return sendMessageDefault(bot, chatId, `
❌ <b>Số tiền chuyển tối thiểu là ${parseInt(min_transferMoney, 10).toLocaleString()}đ, vui lòng nhập lại: </b>         
            `, optionsButton.null)
    }

    if (telegramId == telegramIdTarget) {
        return sendMessageDefault(bot, chatId, '❌ <b>Không thể chuyển cho bản thân, vui lòng nhập lại: </b>', optionsButton.null)
    }

    let response = await transferMoneyForUser({telegramId, telegramIdTarget, money})
    stateUsers[msg.from.id] = states.NONE
    if (!response.success) {
        return sendMessageDefault(bot, chatId, `❌ <b>${response.message}</b>`, optionsButton.null)
    }
    let data = response.data
    let userRecieved = data.userRecieved
    let moneyRevieved = data.money - (data.money *(2/100))
    let userSend = data.userSend
    await sendMessageDefault(bot, chatId, messages.transferSuccess, optionsButton.all)
    await sendMessageDefault(bot, userRecieved.telegramId, `
♻️ <b>Bạn đã nhận được ${parseInt(moneyRevieved, 10).toLocaleString()}đ từ @${userSend.username} [telegram ID: <code>${userSend.telegramId}</code>]</b>        
        `, optionsButton.null)
    return showAccount(bot, msg)

    
 
}


export default transferMoney;