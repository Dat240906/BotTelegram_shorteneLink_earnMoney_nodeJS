import * as dotenv from 'dotenv' 
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

dotenv.config()
// Xử lý đường dẫn trong môi trường ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const emailTemplatePath = path.resolve(__dirname, '../templates/emailTemplate.html');

// Hàm thay thế placeholder trong template
const populateTemplate = (template, data) => {
  return template.replace(/\${(.*?)}/g, (_, key) => data[key] || '');
};




const sendEmail = async ({emailClient, recipientName, otpCode}) => {
    // Dữ liệu động
    const emailData = {
        recipientName,
        otpCode,
        groupSupport: process.env.GROUP_SUPPORT
    };
    
    // Đọc nội dung của file HTML
    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
    const populatedEmailTemplate = populateTemplate(emailTemplate, emailData);
  
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_ACCOUNT,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

    const info = await transporter.sendMail({
    from: `"Bot Kiếm Tiền 💰" <noreply@botkiemtien.vn>`, // sender address
    to: emailClient, // list of receivers
    subject: "Kích Hoạt Tài Khoản", // Subject line
    html: populatedEmailTemplate,
    });

    if (!info.messageId) {
        return {
            success: false,
            message: "Gửi email thất bại",
        }
    }
    return {
        success: true,
        message: "Email gửi thành công",
    }
}



export default {
    sendEmail
}