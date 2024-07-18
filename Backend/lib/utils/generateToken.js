import jwt from "jsonwebtoken";


export const generateTokenandSetCookie = (userId,res) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d'
    })

    res.cookie("jwt",token,{
        maxAge: 15*24*60*60*1000,
        httpOnly: true, //prevent XSS attacks cross-state scripting attacks means can not be assible by javascript or like that
        sameSite: "strict", //CSRF attacks cross-state request forgery attacks
        secure: process.env.NODE_ENV !== "development", 
    });
}