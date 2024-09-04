import express from 'express';
import * as dotenv from 'dotenv';
import connectDB from './database/database.js';
import {
  userRouter,
  emailServicesRouter,
  otpRouter,
  taskRouter,
  csbm_dksdRouter,
  transactionsRouter,
} from './routes/index.js';
import {
  options, 
  print,
}  from './utils/logColor.js';
import { startNgrokService } from './services/index.js';
import path from "path"
import ejs from "ejs";
import { fileURLToPath } from 'url';
import {runBotTelegram} from './botTelegram/index.js';
// Đọc các biến môi trường



// Kết nối với cơ sở dữ liệu
await connectDB()

//start Ngrok server
const NGROK_URL = await startNgrokService()



// Cấu hình Express
const app = express();
app.use(express.json());

// Đọc đường dẫn cho views
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình EJS
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './templates'));

// Middleware và các router
app.use('/users', userRouter);
app.use('/email', emailServicesRouter);
app.use('/otp', otpRouter);
app.use('/task', taskRouter);
app.use('/csbm-dksd', csbm_dksdRouter);
app.use('/transactions', transactionsRouter);




// Khởi động máy chủ
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  print(`Máy Chủ Khởi Động Thành Công Với Cổng Là: ${PORT}`, options.blue.bgcolor);
});

//khởi động BOT

await runBotTelegram()

export default {
  NGROK_URL,
}