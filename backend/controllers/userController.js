const asyncHandler = require('express-async-handler')
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    console.log("req.body:", req.body);

    // Validation
    if (!name || !email || !password) {
        res.status(400);

        throw new Error("Please fill in all required fields")
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be 6 character");
    }

    // check if user already exist
    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error("Email has already been registered")
    }



    // create new user
    const user = await User.create({
        name,
        email,
        password
    });

    
    // Genereate Token
    const token = generateToken(user._id);


    // send HTTP only cookie
    res.cookie("token",token,{
        path:"/",
        httpOnly:true,
        expires:new Date(Date.now() + 1000 * 86400), 
        sameSite:"none",
        secure:true
    })
    if (user) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id, name, email, photo, phone, bio,token
        })
    } else {
        res.status(400);
        throw new Error("Invalid user Data");
    }
});

module.exports = {
    registerUser,
}