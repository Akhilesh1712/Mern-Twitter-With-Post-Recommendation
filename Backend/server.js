import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT  || 8000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//Middleware to get token from cookies
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
    connectMongoDB();
});
