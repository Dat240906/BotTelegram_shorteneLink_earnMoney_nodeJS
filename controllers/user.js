import BankModel from "../models/Bank.js"
import { UserRepository } from "../repositories/index.js"
import statusCode from "../statusCode/statusCode.js"


const getUserById = async (req, res) => {
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

const getAllUsers = async (req, res) => {
    let response = await UserRepository.getAllUsers()
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
const addBank = async (req, res) => {
    let response = await UserRepository.addBank(req.body)
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
const getDataBank = async (req, res) => {
    let response = await UserRepository.getDataBank(req.params)
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
const getAllDataBank = async (req, res) => {
    let response = await UserRepository.getAllDataBank()
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

const withDrawMoney = async (req, res) => {
    let dataUser = req.body
    let response = await UserRepository.withDrawMoney(dataUser)
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

const transferMoney = async (req, res) => {
    let dataUser = req.body
    let response = await UserRepository.transferMoney(dataUser)
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
const updateBalance = async (req, res) => {
    let dataUser = req.body
    let response = await UserRepository.updateBalance(dataUser)
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

const updateBanks = async (req, res) => {
    let dataUser = req.body
    let response = await UserRepository.updateBanks(dataUser)
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
    addBank,
    getDataBank,
    withDrawMoney,
    transferMoney,
    getAllUsers,
    getAllDataBank,
    updateBalance,
    updateBanks,
}