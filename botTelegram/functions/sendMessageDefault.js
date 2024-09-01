



const sendMessageDefault = async (bot, chatId, message, options) => {
    if (options == null) {
        return bot.sendMessage(chatId, `${message}`, {parse_mode: "HTML"})
    }
    return bot.sendMessage(chatId, `${message}`, 
        {
            reply_markup: {
                keyboard: options,
                resize_keyboard: true
            },
            parse_mode: "HTML"
        }
     ) 
}
const sendPhoto = async (bot, chatId, photoUrl, caption, options) => {
    if (options == null) {
        return bot.sendMessage(chatId, `${message}`, {parse_mode: "HTML"})
    }
    try {
        return bot.sendPhoto(chatId, photoUrl, {
            caption: `${caption}`,
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: options,
                resize_keyboard:true
            }
        });
    } catch (error) {
        console.error(`Lỗi khi gửi ảnh: ${error.message}`);
    }
};

export {
    sendPhoto,
    sendMessageDefault
}