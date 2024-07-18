import express from "express";
import { getme, login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";


const router = express.Router();


router.get("/getme",protectRoute,getme);

router.post("/signup" , signup);


router.post("/login", login);


router.post("/logout", logout);

export default router;


