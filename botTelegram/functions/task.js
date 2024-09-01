import {
    signTaskForUser
} from '../apis/index.js'
import {tools} from "../tools/index.js"
import { 
    sendMessageDefault,
    sendPhoto,

} from './sendMessageDefault.js'
import messages from '../storages/messages.js'
import options from '../storages/options.js'
import optionsButton from '../storages/options.js'



const showTasks = async (bot, msg) => {
    let { telegramId, chatId} = await tools.getBaseInfo(msg)
    let response = await signTaskForUser({telegramId})
    if (!response.success) {
        return sendMessageDefault(bot, chatId, messages.accountNotActive, optionsButton.tasks)
    }
}
const signTask = async (bot, msg) => {
    let { telegramId, chatId} = await tools.getBaseInfo(msg)
    let response = await signTaskForUser({telegramId})
    if (!response.success) {
        return sendMessageDefault(bot, chatId, messages.accountNotActive, optionsButton.tasks)
    }


}

export default signTask