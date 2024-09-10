import axios from "axios";
import {
    print,
    options
} from '../utils/logColor.js'
import { typeTasks } from "../storages/index.js";

const deleteAllTasks = async (HOST) => {
    try {
        const response = await axios.post(`${HOST}/task/deleteAllTasks`);
        print('Đã xóa hết Task cữ', options.blue.underline)
        console.log(response.data)
    } catch (error) {
        console.error("Error deleting all tasks:", error.message);
        return {
            success: false,
            message: `Error deleting all tasks: ${error.message}`,
        }
    }
}


const createTasksTheServerHas = async (HOST) => {
    const url = `${HOST}/task/create`
    try {
        for (let nameTask of typeTasks.nameAllTaskTheServerHas) {
            console.log(nameTask)
            
            const response = await axios.post(url, {
                "quantity":"3",
                "nameTask":nameTask,
                "typeTask": "Link Rút Gọn",
            });
        }
        print('Đã tạo thành công hết Task mà server hiện có', options.blue.underline)
    } catch (error) {
        console.error("error create all tasks:", error.message);
        return {
            success: false,
            message: `Error create all tasks: ${error.message}`,
        }
    }
}

const setUpTask = async (HOST) => {
    await deleteAllTasks(HOST)
    await createTasksTheServerHas(HOST)
}



export default {
    deleteAllTasks,
    createTasksTheServerHas,
    setUpTask,
}