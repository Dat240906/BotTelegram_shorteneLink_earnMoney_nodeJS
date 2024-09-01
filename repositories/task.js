import mongoose from "mongoose";
import { 
    UserModel,
    TaskModel,
 } from "../models/index.js";
import {
    options, 
    print,
} from '../utils/logColor.js'
import { 
    ShrinkMeIOService
 } from '../services/index.js'
import NGROK_URL from '../server.js'
import crypto from 'crypto'

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

        let allTasks = await TaskModel.find().exec();

        allTasks = allTasks.filter(task => 
            task.ref.get(telegramId) === undefined || task.ref.get(telegramId) === false
        );

        const tasksByName = allTasks.reduce((acc, task) => {
            const { nameTask } = task;
            if (!acc[nameTask]) {
                acc[nameTask] = 0;
            }
            acc[nameTask] += 1; 
            return acc;
        }, {});

        const result = Object.keys(tasksByName).map(nameTask => ({
            nameTask,
            quantity: tasksByName[nameTask],
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

const createTask = async (quantity, nameTask) => {
    switch (nameTask) {
        case 'shrinkMe':
            return await createTask_shrinkMe(quantity)
            break;
    
        default:
            return {
                success: false,
                message: 'Tên nhiệm vụ không có trong hệ thống',
            }
            break;
    }
};

const createTask_shrinkMe = async (quantity) => {
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
            let response_data = await ShrinkMeIOService.createShortLink(shortLink)
            let newTask = new TaskModel({
                shortLink: response_data.shortenedUrl,
                code,
                nameTask: 'shrinkMe',
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
    console.log(allTask)
    if (!allTask || allTask.length === 0) {
        return {
            success: false,
            message: 'Server havenot Task',
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
    console.log(task)
    console.log(code)
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

export default {
    validateCodeReward,
    createTask,
    signTask,
    getQuantityTaskForUser,
};