import { Router } from "express";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { upload } from "../middlewares/multer.js";
import { uploadController } from "../middlewares/auth.middleware.js";
import { sendMail } from "../utils/sendMail.js";
const router = Router()

router.post('/register', upload.single('avatar'), uploadController, async (req, res) => {
    const { username, email, password, name, avatar } = req.body;

    try {
        const data = {}
        Object.keys({ username, email, password, name, avatar }).forEach((item) => {
            // console.log(item, req.body[item])
            if (item !== "name" && item != "avatar" && req.body[item] === undefined) {
                throw new Error(`${item} is missing`)
            }
            if (req.body[item] !== undefined) data[item] = req.body[item]
        })

        // const data = Object.keys({ username, email, password, name, avatar }).map((item)=>{
        //     if(req.body[item] !== undefined) return req.body[item];
        // })

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            throw new Error('User already exists')
            // return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ ...data, password: hashedPassword });
        // Save user to database
        await newUser.save();

        // Return success response
        return res.status(201).json({ message: 'User registered successfully', data: newUser });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Register failed', error: error.message });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        Object.keys({ identifier, password }).forEach((item) => {
            if (req.body[item] === undefined) {
                if (item === 'identifier') throw new Error(`username or email is missing`)
                throw new Error(`${item} is missing`)
            }
        })

        const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] })

        if (!user) throw new Error("User doesn't exist")

        const isPasswordMatching = await bcrypt.compare(password, user.password);

        if (!isPasswordMatching) throw new Error("Password doesn't match")
        // throw new Error("Either username/email or password is incorrect")

        // const token = jwt.sign(payload, secret)

        const token = jwt.sign({ identifier, id: user._id }, process.env.JWT_SECRET)

        res.json({ msg: "Logged In Successfully", token, user: user })
    } catch (error) {
        res.json({ msg: "failed login", error: error.message })
    }
})

router.get('/logout', async (req, res) => {
    try {
        res.json({ msg: "Logged Out Successfully", status: true })
    } catch (error) {
        res.json({ msg: "failed logout", error: error.message, status: false })
    }
})

router.get('/verify-email', async (req, res) => {
    try {
        const token = req.query.token;

        if (!token) {
            return res.status(400).send('Verification token is missing.');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.email;

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const message = `Hello, ${userEmail}!\n\n

        Welcome to Blog Post app. Your email has been verified successfully.\n

        You can now start exploring our platform and enjoy all the features it offers!\n\n

        Thank you for joining us,\n
        The Blog Post Team`;

        const email = userEmail;
        sendMail(email, 'Email Verification Successful', message);


        // Update the user's status to verified
        user.isVerified = true;
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        console.log('Error verifying email:', error.message);
        if (error.message === 'jwt expired') return res.status(400).json({ message: 'Token expired' });
        res.status(500).json({ message: 'Internal server error' });
    }

});

router.get('/allUsers', async (req, res) => {
    try {
        const users = await User.find();
        res.json({ data: users, msg: 'All Users Fetched Successfully' })
    } catch (error) {

    }
})

export default router;