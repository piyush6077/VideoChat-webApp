import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs"

export const handleSignUp = async ()=>{
    //req data from body
    // validate data
    // check for existing user in db 
    //hash password using bcrypt
    //Generate JWT token 
    // Generate Refresh token and access token
    // create Object       
    // send response
    try {
        
            const {fullname , email , password} = req.body;
            if(!fullname && !email && !password) return res.status(400).json("Please fill the details")
        
            const existingUser = await User.findOne({email})
            if(existingUser) return res.status(400).json("User with the Given Email Existed ")
        
            // const salt = bcrypt.genSalt(10)
            // const hashedPassword = bcrypt.hash(password, salt)

            const user = await User.create({
                fullname,
                email,
                password
            })
        
            const createdUser = await User.findById(user._id).select("-password -refreshToken") 

            return res
            .status(200)
            .json({success:"true" , message:"Account Created Successfully" ,user})
        
    } catch (error) {
        console.log(error)
        res.status(400).json("Failed to create account")
    }       
}