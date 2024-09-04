import {transacitonsRepository} from '../repositories/index.js'
import statusCode from "../statusCode/statusCode.js"




const addTransaction = async (req, res) => {
    const response = await transacitonsRepository.addTransaction(req.body)
    if (response.success) {
        return res.status(statusCode.OK).json({
            success: true,
            data: response.data,
        })
    }
    return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: response.message,
    })
} 

const getTransacitonsForuser =  async (req, res) => {
    const response = await transacitonsRepository.getTransactionsForUser({_idUser:req.params.idUser})
    if (response.success) {
        return res.status(statusCode.OK).json({
            success: true,
            data: response.data,
        })
    }
    return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: response.message,
    })
}

export default {
    addTransaction,
    getTransacitonsForuser,
}