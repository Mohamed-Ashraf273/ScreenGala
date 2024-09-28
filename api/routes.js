import express from 'express'
import ctrl from '../api/controller.js'
const router = express.Router()

// Types: admins, users, both

router.route('/adduser').post(ctrl.addUser) //adding user (users)
router.route('/movie/:id').get(ctrl.authToken, ctrl.getReviews) // get all movie reviews (both)
router.route('/add').post(ctrl.PostReview) // adding a review for useres (users)

//for a user with an id can get, update and delete its review (users)
router.route('/user').get(ctrl.authToken, ctrl.getMyReviews).put(ctrl.updateReview).delete(ctrl.deleteReview) 

//getting all users (admins)
router.route('/getusers').get(ctrl.getAllUsers)

// Login (users)
router.route('/login').post(ctrl.authLogin)

export default router
