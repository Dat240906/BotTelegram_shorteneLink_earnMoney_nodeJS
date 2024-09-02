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

const handleMessage = async (bot, msg) => {
    let idUser = msg.from.id
    let message = await tools.getMessage(msg)
    if (message == '/start') {
        return
    }

    const  res_checkUser = await tools.checkUser(msg)

    console.log(res_checkUser)
    // tất cả những lệnh bên dưới phải kích hoạt tài khoản mới có thể bấm được 

    if (message.toLowerCase() == optionsButton.activeAcount[0][0].toLowerCase()) {
        return activeAccount(bot, msg)
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
        console.log(res_checkUser)
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
        sendMessageDefault(bot, idUser, messages.elseMessage, optionsButton.all)
    }
}


export default handleMessage