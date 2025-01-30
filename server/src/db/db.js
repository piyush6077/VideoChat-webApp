import mongoose from "mongoose"
import dotenv from "dotenv"

export const connectDB= async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGOURI)
        console.log(`MongoDB Connected : ${conn.connection.host}`)
        
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}