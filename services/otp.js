import {authenticator} from 'otplib'
import * as dotenv from 'dotenv'

dotenv.config()
// Tạo mã OTP
const generateSecret = async () => {
    let secret = await authenticator.generateSecret();
    return secret
}
const generateOTP = async (secret) => {
    authenticator.options = { step: 300 };
    let otp = await authenticator.generate(secret);
    return otp 
}
const validateOTP = async ({otp, secret}) => {
    let isDone = await authenticator.check(otp, secret)
    return isDone  // true nếu OTP đúng, false nếu sai
}
export default {
    generateSecret,
    generateOTP,
    validateOTP,
}
