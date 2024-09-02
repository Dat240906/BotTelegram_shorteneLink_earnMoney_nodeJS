import express from 'express' 
import {
    emailController,
} from '../controllers/index.js'

const router = express.Router()

 
router.post('/send', 
    emailController.sendEmail
)


router.post('/validate', 
    emailController.validateEmailForActiveAccount
)



export default router