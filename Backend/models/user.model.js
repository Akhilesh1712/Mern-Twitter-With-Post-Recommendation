import mongoose from "mongoose";
 const userSchema = new mongoose.Schema({

    username:{
        type: String,
        required: true,
        unique: true,
    },
    fullName:{
        type:String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        minLenght:8
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId, // follower will have a type of id
            ref: "User", // going to refrence the user
            default: [] // its value when user sign up new user
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            default: [] // it value when user sign up new user
        }
    ],

    profileImg:{
        type: String,
        default: "",
    },

    coverImg:{
        type: String,
        default: ""
    },
    bio:{
        type: String,
        default: ""
    },
    link:{
        type: String,
        default: ""
    }



 },{timestamps: true}) // through it we can give at creates this account at this eg 2021




 //Model

 const User = mongoose.model("User", userSchema); // even we given sigular User "User" but in model it will be store as Users


 export default User;