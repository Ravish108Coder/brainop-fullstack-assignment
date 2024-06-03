import express from 'express'
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import userRoutes from './routes/user.route.js'
import { connectDB } from './data/database.js';

connectDB()

app.use(cors())
app.use(express.json()); // use for parsing application/json
app.use(express.urlencoded({ extended: true })); // use for parsing application/x-www-form-urlencoded

app.get('/', (req, res)=> {
    res.send('hello world')
})

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/user', userRoutes)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`)
})