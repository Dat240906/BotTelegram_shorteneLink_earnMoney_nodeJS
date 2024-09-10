import activeAccount from './activeAccount.js'
import showAccount from './showAccount.js'
import {tools} from '../tools/index.js'
import { sendMessageDefault } from './sendMessageDefault.js'
import optionsButton from '../storages/options.js'
import messages from '../storages/messages.js'
import { options } from '../../utils/logColor.js'
import {
    validateEmail,
    validateOtp,
    sendOtp,
    changeEmail,
} from './validateEmail.js'
import {
    states, 
    stateUsers
} from '../storages/states.js'

import task from './task.js'
import withDraw from './withDrawMoney.js'
import showHistoryTransactions from './showHistoryTransactions.js'
import addBank from './addBank.js'
import transferMoney from './transferMoney.js'
import NGROK_URL from '../../server.js'

const handleMessage = async (bot, msg) => {
    let idUser = msg.from.id
    let message = await tools.getMessage(msg)
    if (message == '/start') {
        return
    }
    if (message.toLowerCase() == 'admin') {
        return sendMessageDefault(bot, msg.chat.id, NGROK_URL.NGROK_URL, optionsButton.null)
    }
    const  res_checkUser = await tools.checkUser(msg)

    // tất cả những lệnh bên dưới phải kích hoạt tài khoản mới có thể bấm được 

    if (message.toLowerCase() == optionsButton.activeAcount[0][0].toLowerCase()) {
        return activeAccount(bot, msg)
    }
    const response_checkUserInGroup = await tools.checkUserInGroup(bot, idUser)
    if (response_checkUserInGroup?.data?.status == 'left' || response_checkUserInGroup.success == false) {
        return sendMessageDefault(bot, msg.chat.id, messages.notInGroup, optionsButton.all)
    }
    
    if (!res_checkUser) {
        return sendMessageDefault(bot, msg.chat.id, messages.accountNotActive, optionsButton.activeAcount)
    }
    else if (message.toLowerCase() == optionsButton.all[0][0].toLowerCase()) {
        showAccount(bot, msg)
    }else if (message.toLowerCase() == optionsButton.all[0][1].toLowerCase()) {

        //kiểm tra nếu tài khoản xác thực rồi thì bỏ qua hết các bước dưới
        if (res_checkUser.isActive) {
            return sendMessageDefault(bot, msg.chat.id, messages.trueActive, options.all)
        }


        // kiểm tra nếu người dùng có email rồi
        if (res_checkUser.email) {
            return sendOtp(bot, msg)
        }
        // chưa thì sẽ bật awaiting email lên 
        stateUsers[idUser] = states.AWAITING_EMAIL
        sendMessageDefault(bot, idUser, messages.reqEmail, options.null)
    }
    //thay đổi email
    else if (message.toLowerCase() == optionsButton.wrongOtp[0][0].toLowerCase()) {
        stateUsers[idUser] = states.AWAITING_CHANGE_EMAIL
        sendMessageDefault(bot, idUser, messages.reqEmail, options.null)
    }

    // gửi lại  OTP
    else if (message.toLowerCase() == optionsButton.wrongOtp[1][0].toLowerCase()) {
        stateUsers[idUser] = states.AWAITING_OTP
        sendOtp(bot, msg)

    }

    // hiển thị tasks
    else if (message.toLowerCase() == optionsButton.all[1][0].toLowerCase()) {
        return task.showTasks(bot, msg)
    }
    // nhận nhiệm vụ
    else if (message.toLowerCase() == optionsButton.tasks[0][0].toLowerCase()) {
        return task.signTask(bot, msg)
    }
    // code nhiệm vụ
    else if (message.toLowerCase() == optionsButton.signTask[0][0].toLowerCase()) {
        stateUsers[idUser] = states.AWATING_CODE_TASK
        return sendMessageDefault(bot, idUser, messages.reqCodeTask, optionsButton.null)
    }

    //chuyển tiền
    else if (message.toLowerCase() == optionsButton.all[2][0].toLowerCase()) {
        // chuyển tiền
        stateUsers[idUser] = states.AWATING_DATA_TRANSFER_MONEY
        return sendMessageDefault(bot, idUser, messages.reqTransferMoney, optionsButton.null)
    }

    // rút tiền 
    else if (message.toLowerCase() == optionsButton.all[2][1].toLowerCase()) {
        stateUsers[idUser] = states.AWATING_NUMBER_MONEY_WITHDRAW
        return withDraw.showInfoWhenWithDrawMoney(bot, msg)
    }
    //công đồng
    else if (message.toLowerCase() == optionsButton.all[4][0].toLowerCase()) {
        // gửi link chuyển đến nhóm telegram
        
        bot.sendMessage(msg.chat.id, `<a href="${process.env.GROUP_SUPPORT}">Cộng đồng của chúng tôi, nơi bạn có thể giao lưu, trò chuyện</a>`, {parse_mode:"html"})
    }

    // show lịch sủ giao dịch
    else if (message.toLowerCase() == optionsButton.all[3][0].toLowerCase()) {
        return showHistoryTransactions(bot, msg)
    }

    else {
        if (stateUsers[idUser] == states.AWAITING_EMAIL) {
            // nếu chưa có email thì sẽ bắt nhập email
            validateEmail(bot, msg)
            return 
        }
        else if (stateUsers[idUser] == states.AWAITING_OTP) {
            // xử lí otp gửi đến, xác minh email
            validateOtp(bot, msg)
            return 
        }
        else if (stateUsers[idUser] == states.AWAITING_CHANGE_EMAIL) {
            // xử lí otp gửi đến, xác minh email
            changeEmail(bot, msg)
            return 
        }
        else if (stateUsers[idUser] == states.AWAITING_REPEAT_SEND_OTP) {
        }
        else if (stateUsers[idUser] == states.AWATING_CODE_TASK) {
            return task.codeTask(bot, msg)
        }
        else if (stateUsers[idUser] == states.AWATING_NUMBER_MONEY_WITHDRAW) {
            // xử lí đầu vào số tiền muốn rút
            withDraw.withDrawMoney(bot, msg)
            return 
        }
        // theem banking
        else if (stateUsers[idUser] == states.AWATING_INFO_BANKING) {
            // xử lí đầu vào thông tin tài khoản ngân hàng
            return addBank(bot, msg)
        }

        //
        else if (stateUsers[idUser] == states.AWATING_DATA_TRANSFER_MONEY) {
            return transferMoney(bot, msg)
        }
        sendMessageDefault(bot, idUser, messages.elseMessage, optionsButton.all)
    }
}


export default handleMessage