import mongoose, { Schema, Types } from 'mongoose';
import * as dotenv from 'dotenv'
dotenv.config()
// Định nghĩa schema cho Task
const taskSchema = new Schema({
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
    default: 1000
  },
  ref: {
    type: Map,
    of: {type:Boolean},
    default: {},
  },

}, {
  timestamps:true
});


taskSchema.post('save', (doc)=> {
  switch (doc.nameTask) {
    case 'shrinkMe':
      doc.reward = process.env.REWARD_SHRINKMEIO_TASK
      break;
  
    default:
      break;
  }
})


const TaskModel = mongoose.model('Task', taskSchema);

export default TaskModel;
