import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import { Server } from 'socket.io';
import { createServer } from 'http';
import SocketServer from "./socketServer.js";
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import commentRouter from "./routes/commentsRouter.js";
import notifyRouter from "./routes/notifyRouter.js";
import messageRouter from "./routes/messageRouter.js";




dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())




const server = createServer(app);
const io = new Server(server);

io.on("connection", socket => {
    SocketServer(socket)
})

app.use("/api", authRouter)
app.use("/api", userRouter)
app.use("/api", postRouter)
app.use("/api", commentRouter)
app.use("/api", notifyRouter)
app.use("/api", messageRouter)




mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("MongoDb is Connecting...")
    })
    .catch((err) => {
        console.log("err > ",err)
    })



if (process.env.NODE_ENV === "production") {
    app.use(express.static("front/build"))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, 'front', "build", 'index.html'))
    })
}





const port = process.env.PORT || 5050

server.listen(port, () => {
    console.log(`Server is running on port `, port)
})
