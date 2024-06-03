import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
})

export const Post = mongoose.model('Post', PostSchema)