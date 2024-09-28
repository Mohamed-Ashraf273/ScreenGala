import dao from '../api/dao.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


export default class controller{
    static authToken(req, res, next){
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if(token == null) return res.status(400).json({message: "no token is found"})
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.status(403).json({message: "not a valid token"})
            req.user = user
            next()
        })
    }
    static async authLogin(req, res, next){
        try{
            const email = req.body.email
            const password = req.body.password
            const response = await dao.daoLoginCheck(email, password)
            if(response.message === 'Logged in successfully'){
                const user = { id: response.id}
                const accssToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) // userinfo stored hidden here
                res.status(200).json({
                    message: response.message,
                    access_token: accssToken
                })
                return
            }
            res.status(400).json({message: response.message})
        }catch(err){
            res.status(500).json({error: err.message})
        }
        return 
    }
    static async getAllUsers(req, res, next){

    }
    static async addUser(req, res, next){
        try{
            const username = req.body.username
            const email = req.body.email
            //const salt = await bcrypt.genSalt() // because genSalt is an async function we have to wait
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const response = await dao.daoAddUser(username, email, hashedPassword)
            if(!response){
                return res.status(400).json({message: 'username or email already exists'})
            }
            res.status(200).json({message: 'User added successfully'})
        }catch(err){
            res.status(500).json({error: err.message})
        }
        return
    }
    static async PostReview(req, res, next){
        try{
            const uid = parseInt(req.body.uid, 10)
            const review = parseInt(req.body.review, 10)
            const mid = parseInt(req.body.mid, 10)
            const Response = await dao.daoAddreview(
                uid,
                mid,
                review
            )
            if(!Response){
                return res.status(400).json({error: "Can't be added"})
            }
            res.status(200).json({status: "success"})
        }catch(err){
            res.status(500).json({error: err.message})
        }
        return
    } 
    static async getMyReviews(req, res, next){// getting my reviews for all movies
        try{
            let id = parseInt(req.user.id)
            let reviews = await dao.daoGetMyReviews(id)
            if(!reviews){
                return res.status(400).json({error: "Not Found"})
            }
            res.status(200).json(reviews)
        }catch(err){
            res.status(500).json({error: err})
        }
        return
    }
    static async updateReview(req, res, next){
        try{
            const id = req.params.id
            const newRev = req.body.review
            const newUser = req.body.user
            const Response = await dao.daoUpdateReview(
                id,
                newUser,
                newRev
            )
            var error = Response.error
            //note: let assume a shape to Response:
            //const Response = {
            //   error: "erroe messsage",
            //   data: "..."
            //}
            if(error){// note this error may comes from mongoDB
                return res.status(400).json({error})
            }
            res.json({status: "success"})
        }catch(err){
            res.status(500).json({error: err})
        }
        return
    }
    static async deleteReview(req, res, next){
        try{
            const id = req.params.id
            const Response = await dao.daoDeleteReview(id)
            res.json({status: "success"})
        }catch(err){
            res.status(500).json({error: err})
        }
        return
    }
    static async getReviews(req, res, next){
        try{
            let id = req.params.id || {} // get all reviews for a movie
            let Response = await dao.getAllmovieReviews(id)
            if(!Response){
                res.status({status: "success"})
                return
            }
            res.json(Response)
        }catch(err){
            res.status(500).json({error: err})
        }
        return
    }
}