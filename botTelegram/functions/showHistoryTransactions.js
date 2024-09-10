
import {
    getHistoryTransactions,
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

const showHistoryTransactions = async (bot, msg) => {
    let {telegramId, chatId, idUser} = await tools.getBaseInfo(msg)
    let User_response = await getInfoUser({telegramId})
    let response = await getHistoryTransactions({idUser:User_response.data._id})
    if (!response.success) {
        return sendMessageDefault(bot, chatId, messages.errorGetHistoryTransactions, optionsButton.all);
    }

    let data = response.data
    let context = `
<u>📜 Lịch Sử Giao Dịch</u>

⚠️ Định dạng giao dịch: STT, Thời gian | ID | Số tiền | Trạng thái 
`   
    debugger
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) { 
            let transaction = data[i]  
            let status = 'Đang xử lí ♻️'
            let time =await tools.formatDate(transaction.createdAt)
            if (transaction.status == 'success') {
                status = 'Thành công ✅'
            }
            else if (transaction.status == 'fail') {
                status = "Thất bại ❌"
            }
            context += `<i>\n    ${i+1}, ${time} | ${transaction.bank} | ${transaction.money.toLocaleString()} đ | ${status}\n</i>`
        }
    }else {
        context += `\n<i>Hiện đang trống</i>`
    }
    return sendMessageDefault(bot, chatId, context, optionsButton.all) 
}


export default showHistoryTransactions