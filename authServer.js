import express from 'express'
import router from './api/authRoutes.js'
import cors from 'cors'
import { connectDB } from './db.js'

const port = 4000

try{
    connectDB()
    console.log("connected to DB from authServer")
}catch(err){
    console.log(err)
}

const app = express()
app.use(express.json()) 
app.use(cors())
app.use("/api/v1", router) // main URL (http://localhost:4000/api/v1)
app.listen(port, console.log(`authServer running on ${port}`))

export default app
