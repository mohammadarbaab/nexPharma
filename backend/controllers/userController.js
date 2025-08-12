const asyncHandler = require('express-async-handler')
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}
// register user
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
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true
    })
    if (user) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id, name, email, photo, phone, bio, token
        });
    } else {
        res.status(400);
        throw new Error("Invalid user Data");
    }
});


// login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate Request
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add email and password");
    }

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        res.status(400);
        throw new Error("User not found please sign up");
    }

    // User exists now check password if is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (user && passwordIsCorrect) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id,
            name,
            email, 
            photo,
            phone,
            bio
        })
    }else{
        res.status(400);
        throw new Error ("Invalid email or password");
    }
});

module.exports = {
    registerUser,
    loginUser
}