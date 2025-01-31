// import { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs"

export const handleSignUp = async (req,res) => {

    try {
            const {fullname , email , password} = req.body;
            if(!fullname || !email || !password) return res.status(400).json("Please fill the details")
        
            const existingUser = await User.findOne({email})
            if(existingUser) return res.status(400).json("User with the Given Email Existed ")
        
            const user = await User.create({
                fullname,
                email,
                password
            })
        
            const createdUser = await User.findById(user._id).select("-password -refreshToken") 

            return res.status(200).json({success:true , message:"Account Created Successfully" ,createdUser})
        
        } catch (error) {
        console.log(error)
        res.status(400).json("Failed to create account")
    }       
}

export const handleLogin = async (req,res) => {
    try {
        const { email , password } = req.body
        if(!email || !password) return res.status(400).json("Must fill all details")
            
        const loggedInUser = await User.findOne({email})
        const isPasswordValid = await loggedInUser.isPasswordCorrect(password)
    
        if(!isPasswordValid){
            return res.status(400).json("Password is Invalid")
        }
        
        //Generate RefreshToken and AccessToken
        const refreshToken = loggedInUser.generateRefreshToken()
        const accessToken = loggedInUser.generateAccessToken()
    
        loggedInUser.refreshToken = refreshToken
        await loggedInUser.save({validateBeforeSave:true})

        const createdLoggedInUser = await User.findById(loggedInUser._id).select("-password -refreshToken")        
        
        // sending Cookies
        const options = {
            httpOnly: true,
            secure: process.env.NODEENV !== "development"
        }

        return res
        .status(200)
        .cookie("accessToken" , accessToken , options)
        .cookie("refreshToken" , refreshToken , options)
        .json({message:"Logged in Successfully", createdLoggedInUser})

    } catch (error) {
        console.log(error)
        return res.status(400).json("Unable to loggin ")
    }
}

export const handleLogout = async (req,res) => {
    try {
        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                refreshToken: undefined
                }
            },
            {
                new: true
            }
        )
    
        const options = {
            httpOnly: true,
            secure: process.env.NODEENV !== "development" 
        }
    
        return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json("Logout Successfully")
    } catch (error) {
        console.log(error)
        return res.status(400).json("Error during logging Out")
    }
}

export const updateAccountDetail = async (req,res) => {
    try {
        
        const { email , fullname } = req.body
        if(!email && !fullname) return res.status(400).json("Either provide email or fullname to update")
    
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    fullname : fullname,
                    email : email
                }
            },
            {
                new: true
            }
        ).select("-password -refreshToken")
    
        return res
        .status(200)
        .json({message:"User updated successfully" , user: user})
    
    } catch (error) {
        console.log(error)
        return res.status(400).json("Error occured during Updating Account details")
    }
}

export const getCurrentUser = async (req,res) => {
    return res
    .status(400)
    .json({user: req.user , message:"User fetched Successfully"})
}
