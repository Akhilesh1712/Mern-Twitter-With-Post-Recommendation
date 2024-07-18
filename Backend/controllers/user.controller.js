import Notification from "../models/notification.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";

export const getUserProfile = async (req,res) =>{
    const {username} = req.params;

    try {
        const user = await User.findOne({username}).select("-password");

        if(!user){
            return res.status(404).json({error: "User not found with this username"});
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}



export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToFollow = await User.findById(id);//me user user per click (follow per) to vo muhje us ke id dega
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You cannot follow or unfollow yourself." });
        }

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ error: "User not found." });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow
            await userToFollow.updateOne({ $pull: { followers: req.user._id } });
            await currentUser.updateOne({ $pull: { following: id } });

            res.status(200).json({ message: "Unfollowed successfully." });
        } else {
            // Follow
            await userToFollow.updateOne({ $push: { followers: req.user._id } });
            await currentUser.updateOne({ $push: { following: id } });

            // Create and save a follow notification
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToFollow._id,
            });
            await newNotification.save();

            res.status(200).json({ message: "Followed successfully." });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Server error, please try again later." });
    }
};

export const getSuggestUserProfile = async (req,res) =>{
    try {
        const userId = req.user._id;

        const usersfollowedbyme = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match:{
                    _id: {$ne:userId} //mere id no ho 
                }
            },
            {$sample:{size:10}} // we will get 10  user
        ])

        const filteredUser = users.filter(user=>!usersfollowedbyme.following.includes(user._id)); //unme se kisse ke bhi following me hamare id na ho
        const suggestedUsers = filteredUser.slice(0,4); // 4 dedo muhghe different different

        suggestedUsers.forEach(user=>user.password=null);

        res.status(200).json(suggestedUsers);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


export const updateUserProfile = async (req,res) =>{
    const {fullName,email,username,currentPassword,newPassword,bio,link} = req.body; //ye request user degana to waha se uthaye ge ham innhe

    let {profileImg,coverImg} = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found through req"}); //wesse to hamesa found hoga kyuki click to wohi kare ga
        }


        if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return res.status(400).json({error: "Please give both currentpassword and newPassword"});
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword,user.password);
            if(!isMatch) return res.status(400).json({error: "Current password is not correct"});
            if(newPassword.length < 8){
                return res.status(400).json({error: "Should at least 8 char"});
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword,salt);
        }

        if(profileImg){
           if(user.profileImg){//if allready have the image
            await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
           }
           const uploadedResponse = await cloudinary.uploader.upload(profileImg)
           profileImg = uploadedResponse.secure_url;
        }
        if(coverImg){
            if(user.coverImg){//if allready have the image
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }
        //ager update ka mila to thik verna nhi diya to database walla le lena
        user.fullName = fullName || user.fullName; //user ke fullname ko ker do fullname(ager diya to updated) nhi to vo hi rahane do
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;


        user = await user.save();

        user.password = null; //save ke bad diya na ab nhi hoga database me null

        return res.status(200).json(user); // user hame dena hai hai pura per password null kerke
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}