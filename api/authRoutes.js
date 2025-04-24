import express from 'express'
import authCtrl from './authController.js'

const router = express.Router()

// Login (users)
router.route('/login').post(authCtrl.authLogin)
router.route('/token').post(authCtrl.getToken)
router.route('/logout').delete(authCtrl.authLogout)


export default router