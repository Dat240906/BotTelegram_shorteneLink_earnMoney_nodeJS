import mongoose, { Schema, Types } from 'mongoose';
import * as dotenv from 'dotenv'
import {typeTasks} from '../storages/index.js'
dotenv.config()
// Định nghĩa schema cho Task


const taskSchema = new Schema({
  typeTask: {
    type: String,
    required: true,
    enum: [typeTasks.SHORTENLINK, typeTasks.REGISTERACCOUNT]
  },
  nameTask: {
    type: String,
    required: true,
  },
  shortLink: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  reward: {
    type: Number,
    default: 200
  },
  ref: {
    type: Map,
    of: {type:Boolean},
    default: {},
  },

}, {
  timestamps:true
});

const getRandomReward = () => {
  const min = 100;
  const max = Number(process.env.REWARD_SHRINKMEIO_TASK); // Chuyển đổi biến môi trường thành số

  if (isNaN(max)) {
      throw new Error('REWARD_SHRINKMEIO_TASK không phải là một số hợp lệ');
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
taskSchema.pre('save', async function (next) {
  
  switch (this.nameTask) {
    case 'shrinkMe':
      this.reward = getRandomReward()
      next()
    default:
      break;
  }
  
})


const TaskModel = mongoose.model('Task', taskSchema);

export default TaskModel;
