import express from 'express'
import router from './api/routes.js'
import { connectDB } from './db.js'
import cors from 'cors'
const port = 8080

try{
    connectDB()
    console.log("connected to DB form the main server")
}catch(err){
    console.log(err)
}
const app = express()
app.use(express.json()) 
app.use(cors())
app.use("/api/v1", router) // main URL (http://localhost:8080/api/v1)
app.listen(port, console.log(`Server running on ${port}`))

export default app
