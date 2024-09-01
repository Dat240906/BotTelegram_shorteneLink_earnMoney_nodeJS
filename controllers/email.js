import statusCode from "../statusCode/statusCode.js"
import { emailRepository} from "../repositories/index.js"


const sendEmail = async (req, res) => {
    let response = await emailRepository.sendEmail(req.body)
    if (!response.success) {
        return res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: response.message,
        })
    }
    return res.status(statusCode.OK).json({
        success: true,
        data: response.message,
    })
}

const validateEmailForActiveAccount = async (req, res) => {
    let response = await emailRepository.validateEmailForActiveAccount(req.body)
    if (!response.success) {
        return res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: response.message,
        })
    }
    return res.status(statusCode.OK).json({
        success: true,
        data: response.message,
    })
}

export default {
    sendEmail,
    validateEmailForActiveAccount,
}