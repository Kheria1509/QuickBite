import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
// import { response } from "express";

//login user
const loginUser =async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user =await userModel.findOne({email});

        if (!user) {
            return res.status(404).json({ success:false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch) {
            return res.status(400).json({ success:false, message: "Invalid password" });
        }

        const token = createToken(user._id);
        res.json({ success:true, token, message: "Logged in successfully" });

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }


}

const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined!");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret_key", { expiresIn: "1h" });
};


//register user
const registerUser =async(req,res)=>{
    const {name,email,password} = req.body;
    try {
        // checking is user already exists
        const exists= await userModel.findOne({email});
        if (exists) {
            return res.status(400).json({ success:false, message: "Email already exists" });
        }

        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success:false, message: "Invalid email format" });
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ success:false, message: "Password must be Strong"});
        }
        //hashing user password
        const salt= await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt);

        const newuser =new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user= await newuser.save()
        const token =createToken(user._id)
        res.json({success:true,token});
    } catch (error) {
        console.log(error);
        res.json({success:false ,message:"error"})
    }

}


export {loginUser,registerUser};