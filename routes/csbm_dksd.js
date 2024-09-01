import express from 'express' 
import {
    csbm_dksdController,
} from '../controllers/index.js'


const router = express.Router()

router.get('/', 
    csbm_dksdController.showSite
)





export default router