import Notification from "../models/notification.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";


export const creatPost = async (req,res) =>{
    try {
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});
        if(!text && !img){
            return res.status(400).json({error: "Post should have img and text"});
        }
        
        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);

            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user:userId,
            text,
            img,
        })

        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        return res.status(500).json({error: `${error}`});
    }
}


export const likeUnlikePost = async (req,res) =>{
    try {
        const userId = req.user._id;
        const {id} = req.params;
        const post = await Post.findById(id);

        if(!post){
            return res.status(400).json({error: "Post not found in it"});
        }

        const userlikedpostornot = post.likes.includes(userId);
        if(userlikedpostornot){
            //unlike
            await Post.updateOne({_id:id}, {$pull: {likes : userId}});
            await User.updateOne({_id: userId}, {$pull: { likedPost: id}})
            res.status(200).json({message: "Unliked"});

        } else{
           //like
           post.likes.push(userId);
           await User.updateOne({_id: userId}, {$push: { likedPost: id}})
           await post.save();

           //notification

           const notification = new Notification({
            from: userId,
            to: post.user,
            type: "like"
           })
           await notification.save();

           res.status(200).json({message: "Post liked"});
        }
    } catch (error) {
        return res.status(500).json({error: `${error}`});
    }
}

export const commentPost = async (req,res) =>{
      try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        

        if(!text){
            return res.status(400).json({error : "Text field is required"});
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: "Post not found in"});
        }

        const comment  = {user: userId , text}
        post.comments.push(comment);
        await post.save();


        res.status(200).json(post);
      } catch (error) {
        return res.status(500).json({error: `${error}`});
      }   
}

export const deletePost = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error: "Post Not found"});
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "You are not autrised to delete post"});
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Post deleted"});
    } catch (error) {
        return res.status(500).json({error:`${error}`});
    }
}


export const getallPosts = async (req,res) =>{
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        }); // populate returns whole data of user that  comment or post by its id
        
        if(posts.length === 0){
            return res.status(200).json([]);
        }

        res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({error: `${error}`});
    }
}

export const getalllikedPost = async (req,res) =>{
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found in it"});
        }

        const likespost = await Post.find({_id: {$in: user.likedPost}}).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password"
        });

        res.status(200).json(likespost);
    } catch (error) {
        return res.status(500).json({error:`${error}`});
    }
}

export const getFollowingPosts = async (req,res) =>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error: "User not found in it"});

        const following = user.following;
        const feedPosts = await Post.find({user: {$in: following}}).sort({createdAt: -1}).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "commnets.user",
            select: "-password"
        });

        res.status(200).json(feedPosts);
    } catch (error) {
        return res.status(500).json({error: `${error}`});
    }
}

export const getUserPosts = async (req,res) =>{ //means search kerne per us user ke posts
    try {
        const {username} = req.params;
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({error: "User NOT"});
        }

        const posts = await Post.find({user: user._id}).sort({createdAT: -1}).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        });
        res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({error: `${error}`});
    }
}