const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
        trim: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be up to 6 character"],
        // maxLength: [32, "Password must not be more than  23 character"]
    },
    photo:{
        type:String,
        required:[true,"Please add a photo"],
        default:"https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?t=st=1744013969~exp=1744017569~hmac=3a5cc8d6e63636dea8e33d035a3f8392b50718dd57ff80ae56d2c2088e702f5c&w=740"
    },
    phone:{
        type:String,
        default:"+91"
    },
    bio:{
        type:String,
        default:"bio",
        maxLength:[250,"Bio must not be more than 23 character"]
    }
},{
    timestamps:true,
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    
    // encrypt password before saving to DB
    const salt=await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(this.password,salt);
    this.password=hashedPassword;
    next();
})
const User = mongoose.model("User", userSchema);

module.exports = User