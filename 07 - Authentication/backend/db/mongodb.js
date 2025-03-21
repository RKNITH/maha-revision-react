
import mongoose from 'mongoose'

const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('database connected successfully');


    } catch (error) {
        console.log('error in database connection', error);
        res.status(500).json({ success: false, message: error.message })


    }
}


export default connectDB