import userModel from "../models/user.model.js";
import config from "../../config/config.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
export async function registering(req,res){

    const { username,email,password } = req.body;
    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    if(isAlreadyRegistered){
        return res.status(409).json({//conflict
            message : "UserName or Email already exists",
        })
    }
    const hashedPw = crypto.createHash("sha256").update(password).digest("hex");
    const user = await userModel.create({
        username,
        email,
        password:hashedPw
    })
    const token = jwt.sign(
        {
        id:user._id
        },
        config.JWT_SECRET,
        {
            expiresIn :"1d"//expires in 1 day
        }
    )
    res.status(201).json({
        message:"User registered successfully",
        user:{
            username:user.username,
            email:user.email
        },
        token
    })
}

export async function getMe(req,res){
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message : "Token not found"
        })
    }
    let decoded;
    try {
        decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
    const user = await userModel.findById(decoded.id)
    if(!user){
        return res.status(404).json({
            message : "User not found"
        })
    }
    res.status(200).json({
        message:"User fetched successfully",
        user:{
            username:user.username,
            email:user.email
        }
        
    })
}