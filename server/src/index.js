import express from "express"
import userRouter from "./routes/user.routes.js"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./db/db.js"
import cookieParser from "cookie-parser"
dotenv.config()


const app = express()
const PORT = process.env.PORT || 5050 

//middleware
app.use(cors({
    origin: process.env.CORSORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.send("get request here")
})

app.use("/api/v1/", userRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
    connectDB()
})