import statusCode from "../statusCode/statusCode.js"
import {
    ShrinkMeIOService,
    
} from '../services/index.js'
import {TaskRepository} from "../repositories/index.js"
import codeReward from "../services/codeReward.js"


const createTask = async (req, res) => {
    let nameTask = req.body.nameTask 
    let typeTask = req.body.typeTask 
    let quantity = req.body.quantity
    let linkRef = req.body.linkRef
    let response = await TaskRepository.createTask(typeTask, quantity, nameTask, linkRef)
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


const getQuantityTaskForUser = async (req, res) => {
    let response = await TaskRepository.getQuantityTaskForUser(req.params)
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
const signTask = async (req, res) => {
    let response = await TaskRepository.signTask(req.body)
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

const showCompletedCodeReward = async (req, res) => {
    let codeReward = req.params.codeReward    
    return res.render('codeReward', {codeReward})
 
}
const deleteTask = async (req, res) => {
    let idTask = req.params.idTask
    let response = await TaskRepository.deleteTask({idTask})
    return res.send(response)
}

const validateTask = async (req, res) => {
    console.log(req.body)
    let response = await TaskRepository.validateCodeReward(req.body)
    return res.send(response)
}



export default {
    createTask,
    getQuantityTaskForUser,
    signTask,
    showCompletedCodeReward,
    validateTask,
    deleteTask,
}