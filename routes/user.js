import express from 'express' 
import {
    userController,
} from '../controllers/index.js'
import NGROK_URL from '../server.js'


const router = express.Router()

router.get('/', (req, res)  => {
    res.send(NGROK_URL)
})

router.get('/:telegramId', 
    userController.getUserById
)
router.get('/bank/:telegramId', 
    userController.getDataBank
)
 
router.post('/register', 
    userController.createUser
)
router.post('/add-bank', 
    userController.addBank
)
router.post('/withdrawmoney', 
    userController.withDrawMoney
)

router.post('/add-Email', 
    userController.addEmail
)
router.post('/update-Email', 
    userController.updateEmail
)

router.delete('/:telegramId', 
    userController.deleteUser
)



export default router