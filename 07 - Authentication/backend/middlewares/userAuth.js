
import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {

    try {

        const { token } = req.cookies

        if (!token) {
            return res.status(400).json({ success: false, message: 'Not Authorised login again' })
        }
        const tokenDcoded = jwt.verify(token, process.env.JWT_SECRET)
        if (tokenDcoded.id) {
            req.body.userId = tokenDcoded.id
        }
        else {
            res.status(400).json({ success: false, message: 'not authorised login again' })
        }

        next()

    } catch (error) {
        console.log('user auth error', error);
        res.status(500).json({ success: false, message: error.message })

    }
}


export default userAuth