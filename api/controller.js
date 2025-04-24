import dao from '../api/dao.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export default class controller{
    static authToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) {
            return res.status(400).json({ message: "No token found" })
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                // Check if the error is due to token expiration
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: "Token expired" }) // 401 for unauthorized due to expired token
                }
                return res.status(403).json({ message: "Not a valid token" }) // 403 for other token errors
            }
            req.user = user
            next();
        })
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