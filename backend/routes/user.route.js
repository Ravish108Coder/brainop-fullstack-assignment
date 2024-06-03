import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { sendMail } from "../utils/sendMail.js";
const router = Router()

import jwt from 'jsonwebtoken'

const generateVerificationToken = (email) => {
    // Create a token that expires in 15 minutes
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return token;
};

router.use(isAuthenticated);

router.get('/chech-verification-status', (req, res) => {
    const { isVerified } = req.user;
    return res.status(200).json({ isVerified });
});

router.get('/sendMail', async (req, res) => {
    try {
        const { email } = req.user;

        const token = generateVerificationToken(email);

        const message = `Hello, ${email}!\n\n
        Welcome to Blog Post app. To verify your email address and complete your registration, please click the link below:\n
        http://localhost:8080/api/auth/verify-email?token=${token}\n
        Please note that this link will expire in 15 minutes. If you did not request this email, please ignore it.\n\n
        Thank you,\n
        The Blog Post Team`;

        const mailResponse = await sendMail(email, 'Verify your email address', message);

        if (mailResponse.status) {
            return res.status(200).json({ message: 'Email sent successfully', status: true });
        } else {
            if (mailResponse.msg === "Invalid email address") {
                return res.status(400).json({ message: 'Invalid email address', status: false });
            } else {
                return res.status(500).json({ message: 'Email sending failed', error: mailResponse.msg, status: false });
            }
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: 'Email sending failed', error: error.message, status: false });
    }
});


export default router;