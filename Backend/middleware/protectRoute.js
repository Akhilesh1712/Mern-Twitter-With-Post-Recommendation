import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        // Get the token from cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Please log in" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid token, please log in again" });
        }

        // Find the user by ID
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};