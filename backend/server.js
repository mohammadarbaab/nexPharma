const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // ✅ Parse URL-encoded form data

// Routes
app.use("/api/users", userRoute);
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Home Page");
});

app.post("/test", (req, res) => {
    console.log("BODY:", req.body);
    res.send("OK");
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
        app.listen(PORT, () => {
            console.log(`Server Running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    });
