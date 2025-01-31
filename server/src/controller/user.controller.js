// import { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs"
import { generateAccessTokenRefreshToken } from "../utils/generateRefreshAccessToken.js";
import jwt from "jsonwebtoken"

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
        
        const {accessToken , refreshToken} = await generateAccessTokenRefreshToken(loggedInUser._id)

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

export const getRefreshToken = async (req,res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken 
    if(!incomingRefreshToken) return res.status(400).json("No Refresh token ")
console.log(incomingRefreshToken)
    
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken ,
            process.env.REFRESH_TOKEN_SECRET
        )
        
        const user = await User.findById(
            decodedToken._id
        )
        
        if(!user){
            return res.status(400).json("invalid Refresh Token - Unauthorized")
        }
        
        if(incomingRefreshToken !== user?.refreshToken){
            return res.status(400).json("Invalid Refresh Token")
        }
    
        const {accessToken , refreshToken} = await generateAccessTokenRefreshToken(user._id)
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:true})
       
        const options = {
            httpOnly: true,
            secure: process.env.NODEENV !== "development" 
        }

        return res
        .status(200)
        .cookie("accessToken" , accessToken ,options)
        .cookie("refreshToken", refreshToken ,options)
        .json({message:"New Access Token Created" , accessToken:accessToken , refreshToken:refreshToken})
    } catch (error) {
        console.log(error)
    }
}