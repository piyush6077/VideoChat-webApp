import express from "express"
import userRouter from "./routes/user.routes.js"
import dotenv from "dotenv"
import { connectDB } from "./db/db.js"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5050 

app.get("/",(req,res)=>{
    res.send("get request here")
})

app.use("/api/v1/", userRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
    connectDB()
})