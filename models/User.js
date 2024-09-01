import mongoose, { Schema } from 'mongoose';


// Định nghĩa schema cho User
const userSchema = new Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type:String,
    unique: true,
    default: '',
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  secretGetOtp: {
    type: String,
    required: true,
    unique: true,
  },

  balance: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
 
}, {
  timestamps: true, // Thêm timestamps (createdAt và updatedAt) cho m��i document
});

// Tạo model User từ schema
const UserModel = mongoose.model('User', userSchema);

export default UserModel;
