import * as dotenv from 'dotenv'
import NGROK_URL from '../server.js'
dotenv.config()


const homeAdmin = async (req, res) => {
    const secretAccessAdminSite = req.params.secretAccessAdminSite
    const secretMain = process.env.SECRET_ACCESS_ADMIN_SITE
    if (secretAccessAdminSite == secretMain) {
        return res.render('adminSite', {HOST: NGROK_URL.NGROK_URL})
    }
    return res.send('LOL')
}


export default {
    homeAdmin,
}