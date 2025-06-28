import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import path from "path";
import { fileURLToPath } from 'url';
import serverless from "serverless-http"; // <-- add this

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// app.use(express.static("public"))
app.use(cookieParser())

// Serve static files from the local dist folder (inside Vidora_Backend)
// app.use(express.static(path.resolve(__dirname, "../dist")));

// app.get("/", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../dist/index.html"));
// });

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

// routes import

import userRouter from "./routes/user.route.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

app.get("/ping", (req, res) => res.send("pong"));

//routes declaration
// when router is not getting exported then simply use app.get()
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)


const handler = serverless(app);

export { app };         
export default handler; 