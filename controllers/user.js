import { UserRepository } from "../repositories/index.js"
import statusCode from "../statusCode/statusCode.js"


const getUserById = async (req, res) => {
    console.log(req.params)
    let response = await UserRepository.getUserById(req.params)
    if (response.success) {
        res.status(statusCode.OK).json({
            success: true,
            data: response.data
        })
    } else {
        res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: response.message
        })
    }
    
} 

const createUser = async (req, res) => {
    let dataUser = req.body

    let response = await UserRepository.createUser(dataUser)
    if  (response.success) {
        res.status(statusCode.OK).json({
            success: true,
            data: response.data
        })
    }else {
        res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: response.message
        })
    }
    
}


const deleteUser = async (req, res) => {
    let dataUser = req.params
	console.log(dataUser)
    let response = await UserRepository.deleteUser(dataUser)
    if  (response.success) {
        res.status(statusCode.OK).json({
            success: true,
            data: response.message
        })
    }else {
        res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: response.message
        })
    }
    
}



const addEmail = async (req, res) => {
    let dataUser = req.body
    console.log(req.body)
    let response = await UserRepository.addEmail(dataUser)
    if  (response.success) {
        res.status(statusCode.OK).json({
            success: true,
            data: response.message
        })
    }else {
        res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: response.message
        })
    }
}

const updateEmail = async (req, res) => {
    let dataUser = req.body
    let response = await UserRepository.updateEmail(dataUser)
    if  (response.success) {
        res.status(statusCode.OK).json({
            success: true,
            data: response.message
        })
    }else {
        res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: response.message
        })
    }
}



export default {
    getUserById,
    createUser,
    deleteUser,
    addEmail,
    updateEmail,
}