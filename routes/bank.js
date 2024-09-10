import express from 'express' 
import {
    userController,
} from '../controllers/index.js'

const router = express.Router()

 
router.get('/all', 
    userController.getAllDataBank
)

router.post('/updateBanks', 
    userController.updateBanks
)



export default router