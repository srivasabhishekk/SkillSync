const express = require('express')

const authRouter = express.Router()
const { registerUserController, loginUserController, resetUserPassword, logoutUserController, getMeController } = require('../controllers/auth.controller') 
const authMiddleware = require('../middlewares/auth.middleware')

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access public
 */

authRouter.post('/register', registerUserController)

/**
 * @route POST /api/auth/login
 * @description Logins an exisiting user
 * @access public
 */

authRouter.post('/login', loginUserController)

/**
 * @route POST /api/auth/reset-password
 * @description Resets user password
 * @access public
 */

authRouter.post('/reset-password', resetUserPassword)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */

authRouter.get('/get-me', authMiddleware.authUser, getMeController)

/**
 * @route GET /api/auth/logout
 * @description logouts a user
 * @access public
 */

authRouter.get('/logout', logoutUserController)

module.exports = authRouter