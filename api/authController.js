import dao from '../api/dao.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export default class authController{
    static generateToken = (user) => {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10s'})
        return token
    }
    static async getToken(req, res, next){
        const refrshToken = req.body.refreshToken
        const isFound = await dao.daoFindToken(refrshToken)
        if(refrshToken == null) {
            return res.status(400).json({message: "No token found"})
        }
        if(!isFound) {
            return res.status(401).json({message: 'Not in DB'}) 
        }
        jwt.verify(refrshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid refresh token" })
            }
            const acssToken = authController.generateToken({id: user.id})
            return res.status(200).json({accessToken: acssToken})
        })
    }
    static async authLogin(req, res, next){
        try{
            const email = req.body.email
            const password = req.body.password
            const response = await dao.daoLoginCheck(email, password)
            if(response.message === 'Logged in successfully'){
                const user = { id: response.id}
                const accssToken = authController.generateToken(user) // userinfo stored hidden here
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
                const is_Rtoken_Added = await dao.daoAddRefreshToken(refreshToken) 
                if(!is_Rtoken_Added) return res.status(401).json({message: "Can't login, because no refersh token is added"}) 
                //console.log(refreshToken)
                res.status(200).json({
                    message: response.message,
                    access_token: accssToken,
                    refresh_token: refreshToken
                })
                return
            }
            res.status(400).json({message: response.message})
        }catch(err){
            res.status(500).json({error: err.message})
        }
        return 
    }
    static async authLogout(req, res, next){
        try{
            const tokenToDelete = req.body.token
            const response = await dao.daoDeleteToken(tokenToDelete)
            if(!response) {
                return res.status(400).json({message: "Can't delete token"})
            }
            return res.status(200).json({message: "Token deleted"})
        }catch(err){
            res.status(500).json({message: "Server error"})
        }  
        return
    }
}