import mongoose, { Schema, Types } from 'mongoose';

// Định nghĩa schema cho Transaction
const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model Transaction từ schema
const TransactionModel = mongoose.model('Transaction', transactionSchema);

export default TransactionModel;
