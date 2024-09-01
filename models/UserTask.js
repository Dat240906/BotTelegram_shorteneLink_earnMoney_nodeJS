import mongoose, { Schema, Types } from 'mongoose';

// Định nghĩa schema cho UserTask
const userTaskSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model UserTask từ schema
const UserTaskModel = mongoose.model('UserTask', userTaskSchema);

export default UserTaskModel;
