import {createUser} from '../apis/index.js'
import {tools} from "../tools/index.js"
import {sendMessageDefault} from './sendMessageDefault.js'
import messages from '../storages/messages.js'
import optionsButton from '../storages/options.js'



const activeAccount = async (bot, msg) => {
    let { telegramId, username, name, chatId} = await tools.getBaseInfo(msg)
    let isDone = await createUser({telegramId, username, name})
    console.log('đây là thông báo từ activeAcount.js %s', isDone)
    if (!isDone) {
        if (isDone == undefined) {
            return sendMessageDefault(bot, chatId, messages.accountExist, optionsButton.all )
        }
        return sendMessageDefault(bot, chatId, messages.errorActiveAccount, optionsButton.activeAcount )
    }
    return sendMessageDefault(bot, chatId, messages.accountExist, optionsButton.all )
}

export default activeAccount