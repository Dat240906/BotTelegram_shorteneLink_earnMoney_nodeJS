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
 
router.post('/register', 
    userController.createUser
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