import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    if (!token) {
        return res.status(200).json({ status: false, message: 'User not logged in' })
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) {
            return res.status(200).json({ status: false, message: 'User not verified' })
        }
        const user = await User.findById(verified.id).select('-password');
        if (!user) {
            return res.status(200).json({ status: false, message: 'User not found' })
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(200).json({ status: false, message: error.message })
    }
};

export const uploadController = async (req, res, next) => {
    try {
        if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            res.send({ msg: 'Only image files (jpg, jpeg, png) are allowed!' })
        };
        const result = await cloudinary.uploader.upload(req.file.path);
        // console.log(result)
        req.body.avatar = result.secure_url
        next()
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error in uploading image"
        });
    }
}