import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenandSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Check if username already exists
        const existUser = await User.findOne({ username });
        if (existUser) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Check if email already exists
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ error: "Email already exists, please login" });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ error: "Password should be at least 8 characters" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
        });

        // Save new user and generate token
        await newUser.save();
        generateTokenandSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
        });

    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });

        // Check if user exists and if the password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate token and set cookie
        generateTokenandSetCookie(user._id, res);

        // Respond with user details
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
    } catch (error) {
        // Handle internal server error
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};


export const  logout = async (req,res) =>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message: "Logout Successfully"});
    } catch (error) {
        res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
}


export const getme = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Server error, please try again later." });
    }
};
