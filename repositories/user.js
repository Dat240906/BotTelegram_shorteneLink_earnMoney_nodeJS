import {
  UserModel,
  BankModel,
  TransactionModel,
} from '../models/index.js'; 
import { options, print } from '../utils/logColor.js';
import { codeRewardService, OTPService } from '../services/index.js';
import Bank from '../models/Bank.js';

const getUserById = async ({ telegramId }) => {
  try {
    const user = await UserModel.findOne({ telegramId });
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, message: `Error finding user: ${error.message}` };
  }
};

const getAllUsers = async () => {
  try {
    const users = await UserModel.find();
    if (!users || users.length === 0) {
      return { success: false, message: 'User not found' };
    }
    return { success: true, data: users };
  } catch (error) {
    return { success: false, message: `Error finding user: ${error.message}` };
  }
};

const createUser = async ({ telegramId, username, name }) => {
  try {
    const existingUser = await UserModel.findOne({ telegramId });
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    const newUser = new UserModel({
      telegramId,
      username,
      name,
      secretGetOtp: await OTPService.generateSecret(),
    });

    await newUser.save();
    print(`Có thành viên mới kích hoạt tài khoản [@${newUser.username}]`, options.blue.bgcolor);
    return { success: true, data: newUser };
  } catch (error) {
    return { success: false, message: `Error creating user: ${error.message}` };
  }
};

const deleteUser = async ({ telegramId }) => {
  try {
    const result = await UserModel.deleteOne({ telegramId });
    if (result.deletedCount === 0) {
      return { success: false, message: 'User not found' };
    }
    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    return { success: false, message: `An error occurred: ${error.message}` };
  }
};

const addBank = async ({telegramId, typeBank, nameBank, numberAccountBank}) => {
  let user = await UserModel.findOne( {telegramId}).exec();
  if (!user) {
    return { success: false, message: 'Không tìm thấy người dùng' };
  }

  if (user.bank) {
    return { success: false, code: 1 ,message: 'User đã có bank rồi' };
  }
  try {
    let newBank = new BankModel({
      typeBank,
      nameBank,
      numberAccountBank,
    });
    await newBank.save();

    // tạo bank xong thì thêm bank đó vào user
    user.bank = newBank._id
    await user.save();
    print(`Bank của tài khoản [@${user.username}] đã được thêm`, options.cyan.underline);
    return { success: true,code:0 ,message: 'Thêm bank thành công' };
  }catch (e) {
    if (e.code == 11000) {
      return { success: false, code: 1, message: 'Tài khoản ngân hàng này đã tồn tại trong hệ thông, vui lòng nhập tài khoản khác' };
    }
    return { success: false, message: `Lỗi bank: ${e?.message || e}` };
  }
}
const getDataBank = async ({telegramId}) => {
  let idBank_temp = '66d83615f80f1de983158808'
  if (telegramId.length == idBank_temp.length) {
    let bank = await BankModel.findOne({_id: telegramId})
    console.log(bank)
    return {
      success: true,
      data: bank
    } 
  }
  try {
    let user = await UserModel.findOne({telegramId}).exec()
    if (!user) {
      return { success: false, message: 'Không tìm thấy người dùng' };
    }
  
    if (!user.bank) {
      return { success: false, code: 1 ,message: 'User chưa có bank ' };
    }
    let bank = await BankModel.findOne({_id: user.bank})
    return {
      success: true,
      data: bank
    } 
  } catch (e) {
    return { success: false, message: `Lỗi bank: ${e?.message || e}` };
  }

}

const getAllDataBank = async () => {
  try {
    let banks = await BankModel.find().exec()
    if (!banks) {
      return { success: false, message: 'Không tìm thấy ngân hàng' };
    }
  
    return {
      success: true,
      data: banks
    } 
  } catch (e) {
    return { success: false, message: `Lỗi bank: ${e?.message || e}` };
  }

}


const withDrawMoney = async ({telegramId, money}) => {
  let user = await UserModel.findOne({telegramId}).exec();
  if (!user) {
    return { success: false, message: 'Không tìm thấy người dùng' };
  }
  if (!user.bank) {
    return { success: false, code: 1 ,message: 'User chưa có bank' };
  }
  let bank = await BankModel.findOne({_id: user.bank})
  if (user.balance < money) {
    return { success: false, code: 1, message: 'Số dư không đủ' };
  }

  let newTransaction = new TransactionModel({
    user: user._id,
    bank: user.bank,
    money
  }) 
  await newTransaction.save()
  user.balance -= money;
  await user.save();
  return {
    success: true,
    message: 'Rút tiền thành công',
    data: {
      money: money,
      bank: `${bank.typeBank} | ${bank.numberAccountBank} | ${bank.nameBank}`
    }
  }

}

const addEmail = async ({telegramId, email}) => {
  let user = await UserModel.findOne( {telegramId}).exec();
  if (!user) {
    return { success: false, message: 'User not found' };
  }

  if (user.email) {
    return { success: false, code: 1 ,message: 'User đã có email rồi' };
  }
  try {
    user.email = email;
    await user.save();
    print(`Email của tài khoản [@${user.username}] đã được thay đổi thành ${email}`, options.cyan.underline);
    return { success: true,code:0 ,message: 'Thêm email thành công' };
  }catch (e) {
    debugger
    if (e.code == 11000) {
      return { success: false, code:2, message: `Email đã tồn tại trên hệ thống` };
    }
    if ("email" in e.errors) {
      return { success: false, code:3,  message: `Email không hợp lệ` };
    }
    return { success: false, message: `Lỗi email: ${e?.message || e}` };
  }
}

const updateEmail = async ({telegramId, email}) => {
  let user = await UserModel.findOne( {telegramId}).exec();
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  if (!user.email) {
    return { success: false, message: 'Chưa thêm email' };
  }
  if (user.email == email) {
    return { success: true, message: 'Cập nhật email thành công' };
  }
  try {
    user.email = email;
    await user.save();
    print(`Email của tài khoản [@${user.username}] đã được thay đổi thành ${email}`, options.cyan.underline);
    return { success: true, message: 'Cập nhật email thành công' };
  }catch (e) {
    if (e.code == 11000) {
      return { success: false, message: `Email đã tồn tại trên hệ thống` };
    }
    if ("email" in e.errors) {
      return { success: false, message: `Email không hợp lệ` };
    }
    return { success: false, message: `Lỗi email: ${e?.message || e}` };
  }
}


const transferMoney = async ({telegramId, telegramIdTarget, money}) => {
  console.log(`${telegramId} ${telegramIdTarget} ${money}`)
  let user = await UserModel.findOne({telegramId}).exec();
  if (!user) {
    return { success: false, message: 'Không tìm thấy người chuyển' };
  }
  let userTarget = await UserModel.findOne({telegramId:telegramIdTarget}).exec()
  if  (!userTarget) {
    return { success: false, message: 'Không tìm thấy người nhận' };
  }

  if (user.balance < money) {
    return { success: false, message: 'Số dư không đủ' };
  }
  // số dư đủ rồi,bắt dầu chuyển

  user.balance -= money
  userTarget.balance += money - (money*(2/100))

  await user.save()
  await userTarget.save()

  return {
    success: true,
    message: 'Chuyển tiền thành công',
    data: {
      money: money,
      userRecieved: userTarget,    
      userSend: user,
    }
  }
 
}

const updateBalance = async (data) => {
  for (let dataUser of data) {
    let _id = dataUser._id;
    let balance = parseInt(dataUser.balance, 10);
    try {
      // Cập nhật số dư cho người dùng
      let resuilt = await UserModel.updateOne(
        { _id },
        { $set: { balance } }
      );
    
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error(`Failed to update user with ID: ${_id}. Error: ${error.message}`);
      return {
        success: false,
        message: `Lỗi cập nhật số dư cho người dùng`,
      }
    }
  }
  return {
    success: true,
    message: `Cập nhật số dư cho người dùng thành công`,
  }
};

const updateBanks = async (data) => {
  for (let dataBank of data) {
    let _id = dataBank._id
    let typeBank = dataBank.typeBank;
    let numberAccountBank = dataBank.numberAccountBank
    let nameBank = dataBank.nameBank

    try {
      // Cập nhật số dư cho người dùng
      let resuilt = await BankModel.updateOne(
        { _id },
        { $set: { typeBank, numberAccountBank, nameBank} }
      );
      console.log(resuilt)
    
    } catch (error) {
      return {
        success: false,
        message: `Lỗi cập nhật ngân hàng người dùng`,
      }
    }
  }
  return {
    success: true,
    message: `Cập nhật ngân hàng người dùng thành công`,
  }
};




export default {
  createUser,
  getUserById,
  deleteUser,
  addEmail,
  addBank,
  updateEmail,
  getDataBank,
  withDrawMoney,
  transferMoney,
  getAllUsers,
  getAllDataBank,
  updateBalance,
  updateBanks,
};

