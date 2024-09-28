import {GetPool} from '../db.js'
import bcrypt from 'bcrypt'

export default class dao{
    static async daoLoginCheck(email, password) {
        try {
            const pool = await GetPool()
            const result = await pool.request()
                .input('Email', email)
                .query(`
                    SELECT *
                    FROM Users
                    WHERE email = @Email
                `)
    
            if (result.recordset.length !== 0) {
                const isMatch = await bcrypt.compare(password, result.recordset[0].password)
                if (isMatch) {
                    return {
                        message: 'Logged in successfully',
                        id: result.recordset[0].uid.toString() // Use the correct index
                    }
                }
                return {
                    message: 'Wrong password, please try again!'
                }
            }
            return {
                message: 'There is no user with this account, please sign up first'
            }
        } catch (err) {
            console.error("Error: ", err)
            return {
                message: 'DB error, please try later :)'
            }
        }
    }    
    static async daoAddUser(username, email, password){
        try{
            const pool = await GetPool()
            const result1 = await pool.request()
                .input('UserName', username)
                .input('Email', email)
                .query(`
                    SELECT *
                    FROM Users
                    WHERE username = @UserName OR email = @Email
                `)
            if(result1.recordset.length === 0){
                const result2 = await pool.request()
                .input('UserName', username)
                .input('Email', email)
                .input('Password', password)
                .query(`
                    INSERT INTO Users (username, email, password)
                    VALUES (@UserName, @Email, @Password)
                `)
            return result2.rowsAffected[0] > 0
            }
        }catch(err){
            console.error("Error: ", err)
        }
        return false
    }
    static async daoAddreview(uid, mid, review){
        try{
            const pool = await GetPool()
            const result = await pool.request()
                .input('UserId', uid)
                .input('MovieId', mid)
                .input('Review', review)
                .query(`
                    INSERT INTO Reviews (uid, mid, review)
                    VALUES (@UserId, @MovieId, @Review)
                `)
            return result.rowsAffected[0] > 0 
        }catch(err){
            console.error("Error: ", err)
        }
        return false
    }
    static async daoGetMyReviews(userId) {
        try {
            const pool = await GetPool()
            const result = await pool.request()
                .input('UserId', userId)
                .query(`
                    SELECT m.movie, r.review
                    FROM Movies m, Reviews r
                    WHERE r.uid = @UserId AND r.mid = m.mid
                `)
            return result.recordset.length > 0 ? result.recordset : []
        } catch (error) {
            console.error("Error in daoGetReview:", error) // Log the error
        }
    }
    static async daoUpdateReview(ud, user, review){

    }
    static async daoDeleteReview(id){

    }
    static async getAllmovieReviews(moviveId){
        try {
            const pool = await GetPool()
            const result = await pool.request()
                .input('MovieId', moviveId)
                .query(`
                    SELECT m.movie, r.review
                    FROM Movies m, Reviews r
                    WHERE m.mid = @movieId AND r.mid = @movieId
                `)
            return result.recordset.length > 0 ? result.recordset : []
        } catch (error) {
            console.error("Error in daoGetReview:", error) // Log the error
        }
        return []
    }
}