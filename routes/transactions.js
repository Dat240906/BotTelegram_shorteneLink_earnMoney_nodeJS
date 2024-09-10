import express from 'express' 
import {
    transactionsController,
} from '../controllers/index.js'
import NGROK_URL from '../server.js'


const router = express.Router()

router.post('/add', 
    transactionsController.addTransaction
)
router.get('/:idUser', 
    transactionsController.getTransacitonsForuser
)
router.get('/all/all', 
    transactionsController.getTransactionsAll
)

router.post('/changeStatus', 
    transactionsController.changeStatus
)

export default router