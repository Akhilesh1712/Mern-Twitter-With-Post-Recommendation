import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { commentPost, creatPost, deletePost, getalllikedPost, getallPosts, getFollowingPosts, getUserPosts, likeUnlikePost } from "../controllers/post.controller.js";

const router = express.Router();


router.post("/create",protectRoute,creatPost);
router.post("/like/:id",protectRoute,likeUnlikePost);
router.post("/comment/:id",protectRoute,commentPost);
router.delete("/:id",protectRoute,deletePost);
router.get("/all",protectRoute,getallPosts);
router.get("/likes/:id",protectRoute,getalllikedPost);
router.get("/following",protectRoute,getFollowingPosts);
router.get("/user/:username",protectRoute,getUserPosts);


export default router;