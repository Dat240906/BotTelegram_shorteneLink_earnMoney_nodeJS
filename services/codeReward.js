import {authenticator} from 'otplib'
// Tạo mã OTP
import crypto from 'crypto';

// Tạo mã OTP ngẫu nhiên dạng chuỗi
export const randomChar = async (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Tập ký tự cho mã OTP
  let otp = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(chars.length); // Sử dụng crypto để đảm bảo tính ngẫu nhiên
    otp += chars[randomIndex];
  }
  return otp;
};

const generateSecret = async () => {
    let secret = await authenticator.generateSecret();
    return secret
}
const generateCodeReward = async (secret) => {
    authenticator.options = { step: 60*10 };
    let code = `${await randomChar(6)}${await authenticator.generate(secret)}`;
    return code 
}
const validateCodeReward = async ({code, secret}) => {
    let init_code = code.slice(-6)
    let isDone = await authenticator.check(init_code, secret)
    return isDone  // true nếu OTP đúng, false nếu sai
}
export default {
    generateSecret,
    generateCodeReward,
    validateCodeReward,
    randomChar,
}
