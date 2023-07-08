const express = require("express");
const app = express();
const dbConncet = require("./dbConnect");
const authRouter = require("./routers/authRouter");
const dotenv = require("dotenv");
const postRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require('cloudinary').v2;
dotenv.config("./.env");

//configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// middlewares
app.use(express.json({ limit: '50mb' }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
    })
);

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.get("/", (req, res) => {
    res.status(200).send("working fine");
});

dbConncet();

const port = process.env.PORT || 4001;
app.listen(port, () => {
    console.log("listening on port: ", port);
});