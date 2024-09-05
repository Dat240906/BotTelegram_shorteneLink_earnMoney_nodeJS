import { 
    getDataBank,
    getInfoUser,
    withDrawMoneyForUser,
 } from "../apis/index.js"
import {tools} from '../tools/index.js'
import { 
    sendMessageDefault,
    sendPhoto,

} from './sendMessageDefault.js'
import optionsButton from '../storages/options.js'
import {
    stateUsers,
    states
} from '../storages/states.js'
import messages from "../storages/messages.js"

const showInfoWhenWithDrawMoney = async (bot, msg) => {
    let { telegramId, chatId} = await tools.getBaseInfo(msg)
    const res_checkBank = await checkBank({telegramId})
    if (!res_checkBank.success) {
        stateUsers[msg.from.id] = states.AWATING_INFO_BANKING
        return sendMessageDefault(bot, chatId, `
<u>❇️ Thêm ngân hàng rút tiền</u>            

↳Nếu bạn dùng <i>MBbank</i> và số tài khoản của bạn là <i>123456789</i> và tên tài khoản là <i>Nguyễn Văn Chí</i> thì hãy nhập:

<code>MBbank/123456789/Nguyen Van Chi</code>

⚠️ Lưu ý:

📌 Kiễm tra kĩ lại thông tin ngân hàng trước khi gửi
📌 Mọi sửa đổi về ngân hàng sau khi lưu thành công sẽ không được cho phép

<b>Hãy cung cấp ngân hàng (theo chuẩn dạng bên trên):</b>
            `, optionsButton.null)
    }
    const res_infoUser = await getInfoUser({telegramId}) 
    let data = res_checkBank.data 
    const typeBank = data.typeBank
    const nameBank = data.nameBank
    const numberAccountBank = data.numberAccountBank
    let infoBank = `${typeBank} | ${await tools.maskStr(numberAccountBank, 3)} | ${await tools.maskStr(nameBank, 1)}`
    let context = `
💰 Số dư: <b>${res_infoUser.data.balance.toLocaleString()} đ</b>
💳 Thông tin ngân hàng: <b>${infoBank}</b> 

⚠️ Lưu ý:

📌 Min rút <b>${parseInt(process.env.MIN_WITHDRAWMONEY, 10).toLocaleString()} đ</b>
📌 Thời gian xử lí: <b>1-2 phút</b>  
📌 Sai thông tin ngân hàng trong quá trình thanh toán vui lòng liên hệ ADMIN

<b>Hãy nhập số tiền muốn rút:</b>
(ví dụ: bạn muốn rút 10,000 đ bạn hãy nhập <i>10000</i>)
    `
    return sendMessageDefault(bot, chatId, context, optionsButton.all)
}

const checkBank = async ({telegramId}) => {
    let response = await getDataBank({telegramId})
    if (!response.success) {
        return { success: false, message: response.message }
    }
    return { success: true, data: response.data }
 
}

const withDrawMoney = async (bot, msg) => {
    let money = msg.text 
    let isCheck = await tools.isInteger(money)
    let { telegramId, chatId} = await tools.getBaseInfo(msg)
    if (!isCheck) {
        return sendMessageDefault(bot, chatId, messages.errorMoney, optionsButton.null)
    }
    if (money < parseInt(process.env.MIN_WITHDRAWMONEY)) {
        stateUsers[msg.from.id] = states.NONE
        return sendMessageDefault(bot, chatId, messages.errorWithDrawMoney, optionsButton.null)
      }
    
    let response = await withDrawMoneyForUser({telegramId, money})
    if (!response.success) {
        stateUsers[msg.from.id] = states.NONE
        return sendMessageDefault(bot, chatId, `<b>❌${response.message}</b>`, optionsButton.all)
    }
    stateUsers[msg.from.id] = states.NONE
    return sendMessageDefault(bot, chatId, messages.trueWithDrawMoney, optionsButton.all)
}
export default {
    showInfoWhenWithDrawMoney,
    withDrawMoney
}