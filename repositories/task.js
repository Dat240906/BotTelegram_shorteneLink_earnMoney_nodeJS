import mongoose from "mongoose";
import { 
    UserModel,
    TaskModel,
 } from "../models/index.js";
import {
    options, 
    print,
} from '../utils/logColor.js'
import NGROK_URL from '../server.js'
import crypto from 'crypto'
import {typeTasks} from '../storages/index.js'
import task from "../controllers/task.js";
import {createShortenLink} from "../services/index.js";

export const randomChar = async (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Tập ký tự cho mã OTP
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(chars.length); // Sử dụng crypto để đảm bảo tính ngẫu nhiên
      otp += chars[randomIndex];
    }
    return otp;
  };
  const getQuantityTaskForUser = async ({ telegramId }) => {
    try {
        const user = await UserModel.findOne({ telegramId }).exec();
        if (!user) {
            return {
                success: false,
                message: 'User không tồn tại',
            };
        }

        // Lấy tất cả các tasks
        let allTasks = await TaskModel.find().exec();

        // Lọc tasks theo điều kiện ref.get(telegramId) === undefined hoặc false
        allTasks = allTasks.filter(task => 
            task.ref.get(telegramId) === undefined || task.ref.get(telegramId) === false
        );

        // Tạo cấu trúc dữ liệu { typeTask: [{ nameTask: "", quantity: 4 }, {}]}
        const tasksByType = allTasks.reduce((acc, task) => {
            const { typeTask, nameTask } = task;

            // Tạo cấu trúc cho từng typeTask nếu chưa có
            if (!acc[typeTask]) {
                acc[typeTask] = {};
            }

            // Tạo hoặc cập nhật số lượng nameTask
            if (!acc[typeTask][nameTask]) {
                acc[typeTask][nameTask] = 0;
            }
            acc[typeTask][nameTask] += 1;

            return acc;
        }, {});

        // Chuyển đổi cấu trúc dữ liệu từ { typeTask: { nameTask: quantity } }
        // thành { typeTask: [{ nameTask: "", quantity: 4 }, {}]}
        const result = Object.keys(tasksByType).map(typeTask => ({
            typeTask,
            tasks: Object.keys(tasksByType[typeTask]).map(nameTask => ({
                nameTask,
                quantity: tasksByType[typeTask][nameTask],
            })),
        }));

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return {
            success: false,
            message: 'Có lỗi xảy ra khi lấy dữ liệu',
        };
    }
};
const createTask = async (typeTask, quantity, nameTask, linkRef) => {
    if (typeTask.toLowerCase() == typeTasks.SHORTENLINK.toLowerCase()) {
        return await createTask_SHORTENLINK(nameTask, quantity)
    }else if (typeTask.toLowerCase() == typeTasks.REGISTERACCOUNT.toLowerCase()) {
        return await createTask_REGISTERACCOUNT(nameTask, linkRef)
    }
    
    else {
        return {
            success: false,
            message: 'Loại nhiệm vụ không hợp lệ',
        }
    }
};
const createTask_REGISTERACCOUNT = async (nameTask, linkRef) => {
    try {
        let newTask = new TaskModel( {
            shortLink:linkRef,
            code: await randomChar(12),
            nameTask,
            typeTask: typeTasks.REGISTERACCOUNT
        })
        await newTask.save()
        print(`Có nhiệm vụ đăng ký tài khoản từ ${nameTask} được khởi tạo`, options.blue.underline)
        return {
            success: true,
            message: `Tạo nhiệm vụ ref thành công`,
            data: newTask,
        };
    }catch (e){
        if (e.code == 11000) {
            return {
                success: false,
                message: 'Link nhiệm vụ đã tồn tại',
            }
        }
        return {
            success: false,
            message: 'Có lõi xảy ra khi tạo nhiệm vụ',
        }
    }
}
const createTask_SHORTENLINK = async (nameTask, quantity) => {
    let creator = null
    if (nameTask == 'shrinkMe') {
        creator = createShortenLink.ShrinkMeIo
    }else if (nameTask == 'yeuMoney') {
        creator = createShortenLink.yeuMoney
    }else if (nameTask == '8Link') {
        creator = createShortenLink._8Link
    }
    else {
        return {
            success: false,
            message: 'Tên nhiệm vụ không có trong hệ thống',
        }
    }
    let data = [];
    try {
        // Chuyển đổi quantity thành số nguyên
        const parsedQuantity = parseInt(quantity, 10);

        // Kiểm tra nếu parsedQuantity không phải là số hoặc nằm ngoài khoảng cho phép
        if (isNaN(parsedQuantity) || parsedQuantity <= 0 || parsedQuantity > 10) {
            return {
                success: false,
                message: `Số lượng phải là số nguyên và phải lớn hơn 0 và nhỏ hơn hoặc bằng 10.`,
            };
        }

        // Tạo nhiệm vụ mới
        for (let i = 0; i < parsedQuantity; i++) {
            let code = await randomChar(12)
            let shortLink = `${NGROK_URL.NGROK_URL}/task/completed/${code}/`;
            let response_data = await creator(shortLink)
            let shortenLink_byService =''
            if (nameTask == '8Link'){
                shortenLink_byService = response_data.shortened_url
            }else {
                shortenLink_byService = response_data.shortenedUrl
            }
            let newTask = new TaskModel({
                shortLink: shortenLink_byService,
                code,
                nameTask,
                typeTask: typeTasks.SHORTENLINK
            });

            await newTask.save();
            data.push(newTask);
        }

        print(`Có ${parsedQuantity} nhiệm vụ ShortLink được tạo mới`, options.blue.default);
        return {
            success: true,
            message: `Tạo ${parsedQuantity} nhiệm vụ thành công`,
            data: data,
        };
    } catch (e) {
        return {
            success: false,
            message: `error: ${e.message || e}`,
        };
    }
}
// chỉ kí những task mà người dùng không có trong ref [tức là task làm rồi sẽ bỏ qua]
const signTask = async ({telegramId}) => {
    let user = await UserModel.findOne({ telegramId }).exec()
    if (!user) {
        return {
            success: false,
            message: 'User not found',
        }
    }
    if (!user.isActive) {
        return {
            success: false,
            message: 'Tài khoản chưa được kích hoạt',
        }
    }
    let allTask = await TaskModel.find().exec()
    if (!allTask || allTask.length === 0)  {
        return {
            success: false,
            message: 'Server havenot Task',
        }
    }
    for (let task of allTask) {
        if (task.ref.get(telegramId) == false) {
            return {
                success: true,
                data: task
            }
        }
    }
    allTask = allTask.filter(task => {
        // Nếu telegramId chưa tồn tại hoặc là false, thì giữ lại task
        return task.ref.get(telegramId) === undefined || task.ref.get(telegramId) === false;
    });

    if (allTask.length === 0) {
        return {
            success: false,
            message: 'Không còn Task',
        };
    }

    let task_random = allTask[Math.floor(Math.random() * allTask.length)]
    task_random.ref.set(`${telegramId}`, false)
    debugger
    await task_random.save()
    return {
        success: true,
        message: 'Đăng kí thành công',
        data: task_random
    }
}

const validateCodeReward = async ({telegramId, code}) => {
    let user = await UserModel.findOne({  telegramId }).exec()
    let task = await TaskModel.findOne({ code }).exec()
    if (!task) {
        return {
            success: false,
            message: 'Task not found',
        }
    }
    if (!user) {
        return {
            success: false,
            message: 'User not found',
        }
    }
    const isCompleted = task.ref.get(`${telegramId}`)
    if (isCompleted) {
        return {
            success: false,
            message: 'User đã lấy nhiệm vụ này',
        }
    }
    if (isCompleted == undefined) {
        debugger
        return {
            success: false,
            message: 'User chưa đăng kí nhiệm vụ này',
        }
    }
    if (!telegramId in task.ref) {
        return {
            success: false,
            message: 'User chưa lấy nhiệm vụ này',
        }
    }
    if (!code == task.code) {
        return {
            success: false,
            message: 'Mã xác thực không đúng',
        }
    }
  

    user.balance += task.reward
    task.ref.set(telegramId, true)
    await task.save()
    await user.save()
    return {
        success: true,
        message: 'Xác thực thành công',
        data: user
    }
}

const deleteTask = async ({idTask}) =>  {
    let task = await TaskModel.deleteOne({_id:idTask}).exec()
    if (!task) {
        return {
            success: false,
            message: 'Task not found',
        }
    }
    return {
        success: true,
        message: 'Xóa task thành công',
    }
}


export default {
    validateCodeReward,
    createTask,
    signTask,
    getQuantityTaskForUser,
    deleteTask,
};