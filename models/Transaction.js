import mongoose, { Schema, Types } from 'mongoose';

// Định nghĩa schema cho Transaction
const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  money: {
    type: Number,
    required: true,
  },
  bank: {
    type: Schema.Types.ObjectId,
    ref: 'Bank',
    required: true,
  },
  status:{
    type: String,
    enum: ['pending', 'success', 'fail'],
    default: 'pending',
  }
},
  { timestamps: true } 
    
);

// Tạo model Transaction từ schema
const TransactionModel = mongoose.model('Transaction', transactionSchema);

export default TransactionModel;
