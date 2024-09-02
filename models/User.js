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
    sparse : true,
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


userSchema.pre('save', async function (next) {
  let email = this.email;
  if (!email) return next();

  try {
    let existEmail = await mongoose.models.User.findOne({ email }).exec();
    if (existEmail && existEmail.telegramId !== this.telegramId) {
      return next({
        code: 11000,
        message: 'Email đã tồn tại',
      });
    }
    next();
  } catch (e) {
    console.error("Lỗi trong quá trình pre save:", e);
    next(e);  
  }
});

// Tạo model User từ schema
const UserModel = mongoose.model('User', userSchema);

export default UserModel;
