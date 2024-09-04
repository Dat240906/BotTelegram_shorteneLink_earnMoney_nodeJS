import {
    signTaskForUser,
    getTasksForUser,
    validateCodeTask,
} from '../apis/index.js'
import {tools} from "../tools/index.js"
import { 
    sendMessageDefault,
    sendPhoto,

} from './sendMessageDefault.js'
import messages from '../storages/messages.js'
import options from '../storages/options.js'
import optionsButton from '../storages/options.js'
import showAccount from './showAccount.js'



const showTasks = async (bot, msg) => {
    let { telegramId, chatId, name} = await tools.getBaseInfo(msg)
    let response = await getTasksForUser({telegramId})
    if (!response.success) {
        return sendMessageDefault(bot, chatId, messages.errorGetTasks, optionsButton.all)
    }
    let data = response.data
    let context = `
<u>🎁 Nhiệm Vụ Kiếm Tiền</u>
    ` 
    for (let task of data) {
        let typeTask = task.typeTask
        let dataTask = task.tasks
        debugger
        context += `\n⚡️ <b>${typeTask}:</b>`
        for (let detailTask of dataTask) {
            context += `\n   ↳ ${detailTask.nameTask}: <b>${detailTask.quantity}</b> nhiệm vụ`
        }
        context += `\n`
    }

    context += `\n
<b>⚠️ chú ý</b>: 

📌 Nhiệm vụ sẽ được <u>nhận ngẫu nhiên</u> kể từ khi bạn nhấn vào <u>Nhận Nhiệm Vụ</u>, mọi thông tin về nhiệm vụ sẽ được hiển thị ngay sau đó

📌 <u>Điều kiện nhận nhiệm vụ mới</u>: Khi không đang làm nhiệm vụ hoặc nhiệm vụ cũ đã hoàn thành
    `

    return sendMessageDefault(bot, chatId, context, optionsButton.tasks)
}
const signTask = async (bot, msg) => {
    let { telegramId, chatId} = await tools.getBaseInfo(msg)
    let response = await signTaskForUser({telegramId})
    if (!response.success) {
        return sendMessageDefault(bot, chatId, messages.errorGetTasks, optionsButton.all)
    }
    let data = response.data
    return sendMessageDefault(bot, chatId, `
<b>✅ Nhận Nhiệm Vụ Thành Công </b>       

↳ Tên nhiệm vụ: <b>${data.typeTask}</b>
↳ Bên cung cấp: <b>${data.nameTask}</b>
↳ Link: <b>${data.shortLink}</b>
↳ Phần thưởng: <b>${data.reward.toLocaleString()} đ</b>

<b>⚠️ chú ý:</b>

📌 Các bước làm nhiệm vụ: <i>copy đường LINK > Dán vào trình duyệt > thực hiện thao tác dựa theo trang web để kiếm tới trang ĐÍCH > ở trang ĐÍCH sẽ có mã CODE > dùng mã đó để nhận thưởng </i>
📌 <u>Tất cả hình thức gian lận</u> nhằm có được phần thưởng nhiệm vụ: <b>BAN VĨNH VIỄN</b>
        `, optionsButton.signTask)


}
const codeTask = async (bot, msg) => {
    let { telegramId, chatId} = await tools.getBaseInfo(msg)
    let code = msg.text
    let response = await validateCodeTask({telegramId, code})
    if (!response.success) {
        return sendMessageDefault(bot, chatId, messages.errorValidateCodeTask, optionsButton.all)
    }
    let data = response.data
    let context = `
<b>✅ Xác thực nhiệm vụ thành công</b>
    `
    sendMessageDefault(bot, chatId, context, optionsButton.tasks) 
    return showAccount(bot, msg)
}
export default {
    showTasks,
    signTask,
    codeTask,
}