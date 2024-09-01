import express from 'express' 
import {
    taskController,
} from '../controllers/index.js'
import NGROK_URL from '../server.js'


const router = express.Router()

router.post('/create', 
    taskController.createTask
)
router.post('/sign', 
    taskController.signTask
)
router.get('/:telegramId', 
    taskController.getQuantityTaskForUser
)


router.get('/completed/:codeReward', 
    taskController.showCompletedCodeReward
)

router.post('/validate', 
    taskController.validateTask
)


export default router