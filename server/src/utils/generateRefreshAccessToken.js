import { User } from "../models/user.models.js"

export const generateAccessTokenRefreshToken = async (userId) =>{
    try {
        const user = await User.findOne({_id:userId})
        if(!user) return res.status(400).json({success:false , message:"No user founded with the Given Id"})
    
        const refreshToken = await user.generateRefreshToken()    
        const accessToken = await user.generateAccessToken()   
        
        user.refreshToken = refreshToken 
        await user.save({validateBeforeSave:true})
        console.log("Saved Refresh Token in DB:", user.refreshToken);


        return { accessToken , refreshToken }
    } catch (error) {
        console.log(error)
        throw new Error("Error generating new code")
    } 
}