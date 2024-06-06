import { Router } from "express";
import { Post } from "../models/post.model.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const router = Router()

// Route to fetch posts with pagination support
router.get('/', isAuthenticated, async (req, res) => {
    const { page, pageSize } = req.query;
    const skip = (page - 1) * pageSize;
    // console.log(`hi ${page}`)
    try {
      const totalPosts = await Post.countDocuments();
      const posts = await Post.find().skip(skip).limit(parseInt(pageSize));
      res.json({ totalPosts, posts });
    } catch (error) {
    //   console.error('Error fetching posts:', error);
      console.log(error.message)
      res.status(500).json({ message: 'Server Error' });
    }
  });

export default router;