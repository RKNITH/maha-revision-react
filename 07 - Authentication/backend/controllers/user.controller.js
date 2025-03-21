
import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import transporter from "../utils/nodemailer.js";


//  function for strong password
function isStrongPassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
}

//  generate token function
const generateToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}



// user registration
const userRegister = async (req, res) => {
    try {

        // get data from input fileds
        const { name, email, password } = req.body

        //  check empty fileds
        if (!name || !email || !password) {
            return res.status(401).json({ success: false, message: 'all fields are required' })
        }

        //  validate email
        if (!validator.isEmail(email)) {
            return res.status(401).json({ success: false, message: 'invalid email' })

        }

        //  check  user already exist or not
        const existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(401).json({ success: false, message: 'email already exist' })
        }

        //   check password strength
        if (!isStrongPassword(password)) {
            return res.status(401).json({ success: false, message: 'password should be atleast 6 digits long and must contains atleast one alphabate, one number, one special character' })
        }

        //  hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        //  create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        })

        const user = await newUser.save()
        const token = generateToken(user._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //  sending registering email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to mern auth with raviranjan',
            text: `Welcome to mern auth with raviranjan. Your account has been crerated with email: ${email} `
        }
        await transporter.sendMail(mailOptions)


        res.status(201).json({ success: true, message: 'user registered successfully', token })

    } catch (error) {
        console.log('error in registration', error);
        res.status(500).json({ success: false, message: error.message })


    }

}



//  user login

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'all fields are required' })
        }

        //  check user exist or not
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: 'user does not exist' })
        }

        //  if user exist then match password
        const matchedPassword = await bcryptjs.compare(password, user.password)
        if (!matchedPassword) {
            return res.status(400).json({ success: false, message: 'wrong password' })
        }

        const token = generateToken(user._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({ success: true, message: 'user login successfully', token })


    } catch (error) {
        console.log('error in login process', error);
        return res.status(500).json({ success: false, message: error.message })


    }
}



// user logout
const userLogout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

        })

        return res.status(201).json({ success: true, message: 'user logout successfully' })

    } catch (error) {
        console.log('error in logout', error);
        return res.status(500).json({ succes: false, message: error.message })


    }
}



//  send verify otp

const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await User.findById(userId)
        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" })
        }
        const otp = String(Math.floor(10000 + Math.random() * 900000))

        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save()

        //  sending otp via mail
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification otp',
            text: `Your OTP is ${otp} `
        }
        await transporter.sendMail(mailOptions)

        res.status(201).json({ success: true, message: 'verification otp send to mail' })


    } catch (error) {
        console.log('error during sending verifiation otp', error);
        res.status(500).json({ success: false, message: error.message })


    }

}


//  verify email
const verifyEmail = async (req, res) => {
    try {
        const { userId, otp } = req.body

        if (!userId || !otp) {
            return res.status(400).json({ success: false, message: 'Missing details' })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ success: false, message: 'user not found' })

        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: 'invalid otp' })
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP expired' })
        }
        user.isAccountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0

        await user.save()

        return res.status(200).json({ success: true, message: 'Email verify successfully' })

    } catch (error) {
        console.log('error during verifying email', error);
        res.status(500).json({ success: false, message: error.message })
    }

}


//  check user authenticated or not

const isAuthenticated = async (req, res) => {
    try {

        res.status(201).json({ success: true, message: 'user authenicated ' })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })

    }

}


//  send password reset otp
const sendResetOtp = async (req, res) => {
    try {

        const { email } = req.body
        if (!email) {
            return res.status(400).json({ success: false, message: 'email is required' })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: 'user not found' })
        }

        const otp = String(Math.floor(10000 + Math.random() * 900000))

        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        //  sending otp via mail
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'password reset otp',
            text: `Your OTP is ${otp} `
        }
        await transporter.sendMail(mailOptions)

        res.status(201).json({ success: true, message: 'reset otp send to mail' })

    } catch (error) {
        return res.status(400).json({ success: false, message: 'email is required' })

    }
}


//  reset user password
const resetPassword = async (req, res) => {

    try {

        const { email, otp, newPassword } = req.body
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: 'all fields are required' })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ success: false, message: 'user not found' })
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: 'invalid otp' })
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'opt expired' })
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetOtp = ''
        user.resetOtpExpireAt = 0

        await user.save()

        return res.status(200).json({ success: true, message: 'password reset successfully' })



    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })

    }


}


//  get user data
const getUserData = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({ success: false, message: 'user not found' })
        }

        res.status(201).json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })

    }
}



export { userRegister, userLogin, userLogout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword, getUserData }