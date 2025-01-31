import mongoose , {Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
    {
        fullname:{
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: [true, "password is required"]
        },
        refreshToken: {
            type: String
        }
    },{
        timestamps:true
    }
)


userSchema.pre("save", async function(next){
    console.log("is this pre hook works")
    if(!this.isModified("password")) return next() ;

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// if error come here 
userSchema.methods.isPasswordCorrect = async function(password){
    console.log("user",password)
    console.log("db",  this.password)
    return await bcrypt.compare(password , this.password)

}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id
    },process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN}
    )
}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN}
    )
}

export const User = mongoose.model("User", userSchema)