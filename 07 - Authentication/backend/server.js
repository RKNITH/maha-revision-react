
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './db/mongodb.js'
import userRouter from './routes/user.route.js'



//  app config
const app = express()
const port = process.env.PORT || 4000



//  middleware
app.use(cors({
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())



//  database
await connectDB()



//  api endpoints
app.get('/', (req, res) => {
    res.send('api working')
})

app.use('/api/v1/user', userRouter)




//  app listen
app.listen(port, () => {
    console.log(`server is running at port ${port}`);

})
