import sql from 'mssql'

// Configuration for the SQL Server connection
const config = {
    server: 'MOHAMED606260\\SQLEXPRESS',  
    database: 'MovieReviews',
    options: {
        encrypt: false,  
        trustServerCertificate: true
    },
    authentication: {
        type: 'default',  
        options: {
            userName: 'Mohamed273',  
            password: 'mm275149' 
        }
    }
}

let pool

export const connectDB = async () => {
    try{
        pool = await sql.connect(config)
        console.log("Success connection to DB")
    }catch(err){
        console.log("Failed to connect to DB: ", err)
        throw err
    }
}

export const GetPool = () =>  pool