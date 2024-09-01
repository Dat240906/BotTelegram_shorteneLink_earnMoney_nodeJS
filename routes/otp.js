import express from 'express' 
import ejs from 'ejs'
import path from 'path'
import { OTPService } from '../services/index.js';
import {options, print} from '../utils/logColor.js'
import statusCode from '../statusCode/statusCode.js'


const router = express.Router();

router.get('/generate/:secret', async (req, res) => {
    try{
        let otp = await OTPService.generateOTP(req.params) 
        res.send(`OTP: ${otp}`);
    }catch (e) {
        print(`Lỗi generateOTP failed ${e.message}`)
        return res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: `error generateOTP failed ${e.message}`
        })
    }
});

router.post('/validate', async (req, res) => {
    let isDone = await OTPService.validateOTP(req.body) 
    if (!isDone) {
        return res.send('false')
    }
    return res.send('true')
});


export default router;