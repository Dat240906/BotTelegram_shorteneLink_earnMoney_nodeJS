import { TransactionModel } from "../models/index.js";



const addTransaction = async ({_idBank, _idUser, money}) => {
    try {
        let transaction = new TransactionModel({
            user:_idUser,
            money,
            bank:_idBank,
        });
        await transaction.save();
        return { success: true, data: transaction };
    }catch (e) {
        console.log(e);
        return { success: false, message: `Lỗi khi thêm giao dịch: ${e?.message || e}` };
    }
}

const getTransactionsForUser = async ({_idUser}) => {
    try {
        let transactions = await TransactionModel.find({ user: _idUser }).exec();
        return { success: true, data: transactions };
    }catch (e) {
        console.log(e);
        return { success: false, message: `Lỗi khi lấy danh sách giao dịch: ${e?.message || e}` };
    }
}

export default  {
    addTransaction,
    getTransactionsForUser,
}