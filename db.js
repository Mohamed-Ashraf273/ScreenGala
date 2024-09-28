import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
        },
    },
}

let pool

export const connectDB = async () => {
    try {
        pool = await sql.connect(config)
        console.log("Success connection to DB")
    } catch (err) {
        console.log("Failed to connect to DB: ", err)
        throw err
    }
}

export const GetPool = () => pool
