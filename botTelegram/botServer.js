import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import { sendPhoto } from './functions/sendMessageDefault.js';
import {tools}  from './tools/index.js';
import optionsButton from './storages/options.js';
import handleMessage from './functions/index.js' 
dotenv.config();

// Token bot của bạn
const token = process.env.TOKEN_BOT;
const idGroup = process.env.ID_GROUP

const runBotTelegram = async () => {
  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/\/start/, async (msg) => {
    let name = await tools.getName(msg)
    sendPhoto(bot, msg.chat.id, "https://tiki.vn/blog/wp-content/uploads/2023/08/thumbnail-app-kiem-tien.jpg", `Chào mừng <b>${name}</b> đã đến với dịch vụ Kiếm Tiền Online đa thiết bị trên nền tảng trên Telegram `, optionsButton.activeAcount )
    
  });

  bot.on('message', async (msg) => {
    if (msg.chat.id < 0) {
      console.log(msg.chat.id)
      
      return 
    }
    handleMessage(bot, msg)
  });

  console.log('Bot đang hoạt động và chờ tin nhắn...');

}

export default runBotTelegram