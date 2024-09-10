import * as dotenv from 'dotenv'

dotenv.config()


const homeAdmin = async (req, res) => {
    const secretAccessAdminSite = req.params.secretAccessAdminSite
    const secretMain = process.env.SECRET_ACCESS_ADMIN_SITE
    console.log(secretAccessAdminSite)
    console.log(secretMain)
    if (secretAccessAdminSite == secretMain) {
        return res.render('adminSite')
    }
    return res.send('LOL')
}


export default {
    homeAdmin,
}