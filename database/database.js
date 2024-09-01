
import mongoose from "mongoose"
import * as dotenv from "dotenv"
import {
  options, 
  print,
} from '../utils/logColor.js'
dotenv.config()
export default async function connectDB() {
    try {
        await mongoose.connect(process.env.URL_DB)   
        print('💾 Kết nối đến DATABASE thành công!', options.success.bgcolor)
      } catch (error) {
        print(`💾 Kết nối đến DATABASE thất bại, lỗi: ${error}`, options.error.bgcolor)
      }
} 