const userModel = require('../models/user.model')
const blacklistTokenModel = require('../models/blacklist.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access public
 */
async function registerUserController(req, res){
    const { username, email, password } = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message : "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or : [ { username }, { email } ]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message : "Account already exists with this email address or username"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username, 
        email, 
        password : hash
    })

    const token = jwt.sign({id : user._id, username : user.username}, process.env.JWT_SECRET, { expiresIn : "1d" })

    res.cookie("token", token)

    return res.status(201).json({
        message : "User registered successfully!",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })
}

/**
 * @name loginUserController
 * @description logins an exisiting user, expects email and password in the request body
 * @access public
 */

async function loginUserController(req, res){
    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({
            message : "Please provide your email and password to login."
        })
    }

    const user = await userModel.findOne({ email })
    
    if(!user){
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message : "Invalid email or password"
        })
    }

    const token = jwt.sign({id : user._id, username : user.username}, process.env.JWT_SECRET, { expiresIn : "1d"})

    res.cookie("token", token)
    
    return res.status(200).json({
        message : "User logged in successfully!",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })
    
}

/**
 * @name resetUserPassword
 * @description resets user password, expects email, password and new password in the request body
 * @access public
 */

async function resetUserPassword(req, res){
    const { email, password, newPassword } = req.body

    if(!email || !password || !newPassword){
        return res.status(400).json({
            message : "All fields are manadatory to reset user password"
        })
    }

    const user = await userModel.findOne({ email })

    if(!user){
        return res.status(400).json({
            message : "User not registered with this email and password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message : "Invalid email or password"
        })
    }

    const hash = await bcrypt.hash(newPassword, 10)

    user.password = hash
    await user.save()

    return res.status(200).json({
        message : "Password changed successfully."
    })
}

/**
 * @name logoutUserController
 * @description Clear cookie after blacklisting the token and logouts the user
 * @access public
 */

async function logoutUserController(req, res){
    const token = req.cookies.token

    await blacklistTokenModel.create({ token })
    res.clearCookie("token")

    res.status(200).json({
        message : "User logged out successfully."
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access private
 */

async function getMeController(req, res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message : "User details fetched successfully.",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })
}

module.exports = { registerUserController, loginUserController, resetUserPassword, logoutUserController, getMeController }