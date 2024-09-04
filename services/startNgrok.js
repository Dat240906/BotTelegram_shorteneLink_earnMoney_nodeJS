import { execa } from 'execa';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; 
import { print, options } from '../utils/logColor.js';

// Xác định đường dẫn của tệp hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc tệp .env hiện tại
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const killNgrok = async () => {
  try {
    // Hủy ngrok nếu nó đang chạy
    await execa('taskkill', ['/f', '/im', 'ngrok.exe'], { shell: true });
  } catch (error) {
    // Kiểm tra nếu lỗi là do không tìm thấy tiến trình
    if (error.stderr && error.stderr.includes('ERROR: The process "ngrok.exe" not found.')) {
      // Không làm gì cả, ngrok không chạy
    } else {
      print(`Lỗi khi kill ngrok [error kill ngrok] ${error.message}`, options.error.bgcolor);
    }
  }
};

const startNgrok = async () => {
  let url = null;

  while (!url) {
    try {
      // Hủy ngrok nếu nó đang chạy
      await killNgrok();

      // Chạy ngrok trong nền
      const ngrokProcess = execa('ngrok', ['http', `${process.env.PORT}`], { shell: true });

      // Đợi một chút để ngrok khởi động
      await new Promise(resolve => setTimeout(resolve, 3000)); // Đợi 5 giây

      // Lấy thông tin từ ngrok API
      const { data } = await axios.get('http://localhost:4040/api/tunnels');

      // Tìm URL trong thông tin từ ngrok API
      url = data.tunnels.find(tunnel => tunnel.proto === 'https')?.public_url;

      if (url) {
        try {
          // Cập nhật tệp .env với URL mới
          const envVars = dotenv.parse(fs.readFileSync(envPath)); // Đọc các biến hiện tại từ tệp .env

          // Thay thế hoặc thêm biến NGROK_URL
          envVars['NGROK_URL'] = url;

          // Ghi lại các biến vào tệp .env
          const newEnvContent = Object.entries(envVars).map(([key, value]) => `${key}=${value}`).join('\n');
          fs.writeFileSync(envPath, newEnvContent);

          print(`Public URL thành công với Ngrok [${url}]`, options.blue.bgcolor);
        } catch (err) {
          print("Không thể cập nhật tệp .env [.env update failed]", options.error.bgcolor);
        }
      } else {
        print("Không tìm thấy URL từ Ngrok API [cannot find URL from Ngrok API]", options.error.bgcolor);
      }

      // Đảm bảo ngrok tiếp tục chạy
      ngrokProcess.stdout.pipe(process.stdout);
      ngrokProcess.stderr.pipe(process.stderr);
    } catch (error) {
      console.error(`Lỗi: ${error.message}`);
    }

    // Nếu không có URL, chờ và thử lại
    if (!url) {
      print("Thử lại để lấy URL từ Ngrok API...", options.red.bgcolor);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Đợi thêm 5 giây trước khi thử lại
    }
  }

  return url;
};

export default startNgrok;
