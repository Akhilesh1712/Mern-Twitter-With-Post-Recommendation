import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT  || 8000;

//middleware
app.use("/api/auth",authRoutes);





app.listen(PORT,() =>{
    console.log(`Server is listining at ${PORT}`);
    connectMongoDB();
})