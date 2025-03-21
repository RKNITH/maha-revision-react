
import express from 'express'
import { userRegister, userLogin, userLogout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword, getUserData } from '../controllers/user.controller.js'
import rateLimit from 'express-rate-limit';
import userAuth from '../middlewares/userAuth.js';


// Limit user registration to 5 attempts per hour
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per window
    message: { success: false, message: 'Too many registration attempts, please try again later.' }
});


const userRouter = express.Router()

userRouter.post('/register', userRegister)
userRouter.post('/login', loginLimiter, userLogin)
userRouter.post('/logout', userLogout)
userRouter.post('/send-verify-otp', userAuth, sendVerifyOtp)
userRouter.post('/verify-account', userAuth, verifyEmail)
userRouter.post('/is-auth', userAuth, isAuthenticated)
userRouter.post('/send-reset-otp', sendResetOtp)
userRouter.post('/reset-password', resetPassword)
userRouter.post('/data', userAuth, getUserData)


export default userRouter