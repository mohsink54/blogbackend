import dotenv from "dotenv";
dotenv.config();
import express from "express"
import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webhookRouter from "./routes/webhook.route.js";
import {clerkMiddleware} from "@clerk/express"
import cors from "cors"


const app = express();
cors({
    origin: ["https://blog-three-delta-88.vercel.app"], // Allow frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
  
app.use(clerkMiddleware());
app.use("/webhooks", webhookRouter);
app.use(express.json());

app.use(function (req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})
app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
  });

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.listen(3000, ()=>{
    connectDB()
    console.log("Server is Running!")
})