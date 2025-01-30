import mongoose , {Schema} from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        fullname:{
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        }
    },{
        timestamps:true
    }
)


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next() ;

    this.password = bcrypt.hash(this.password, 10)
    next()
})

// if error come here 
userSchema.methods.isPasswordCorrect = async(password)=>{
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign({
        _id: this._id
    }),
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN}
}


userSchema.methods.generateRefreshToken = function(){
    jwt.sign({
        _id: this._id
    }),
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN}
}

export const User = mongoose.model("User", userSchema)