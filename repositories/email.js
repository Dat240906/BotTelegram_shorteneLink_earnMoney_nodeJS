import { UserModel } from "../models/index.js";
import { emailService, OTPService } from "../services/index.js";




const sendEmail = async ({telegramId}) => {
    let user = await UserModel.findOne({ telegramId }).exec()
    if (!user) {
        return {
            success: false,
            message: "User not found",
        }
    }
    let emailClient = user.email
    if (emailClient == undefined) {
        return {
            success: false,
            message: "User không có email",
        }
    }
    let recipientName = user.name
    let secretGetOtp = user.secretGetOtp
    let otpCode = await OTPService.generateOTP(secretGetOtp)
    console.log(`${recipientName}, ${secretGetOtp}, ${otpCode}`)

    let response = await emailService.sendEmail({emailClient, recipientName, otpCode})
    if (!response.success)  {
        return {
            success: false,
            message: response.message,
        }
    }
    return {
        success: true,
        message: "Gửi OTP email thành công",
    }
}   

const validateEmailForActiveAccount = async ({telegramId, otp}) => {
    let user = await UserModel.findOne({ telegramId }).exec()
    if (!user) {
        return {
            success: false,
            message: "User not found",
        }
    }
    let secretGetOtp = user.secretGetOtp
    let isDone = await OTPService.validateOTP({otp, secret:secretGetOtp})
    if (!isDone) {
        return {
            success: false,
            message: "Mã OTP không đúng hoặc đã hết hạn",
        }
    }

    user.isActive = true
    await user.save()
    return {
        success: true,
        message: "Xác thực email thành công",
    }
}


export default {
    sendEmail,
    validateEmailForActiveAccount,
}