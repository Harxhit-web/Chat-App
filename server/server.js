import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from "./lib/db.js";
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
    api_key: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing"
});

// create Express app and HTTP server
const app = express();
const server = http.createServer(app)

// Initialize socket.io
export const io = new Server(server, {
  cors: {origin: "*"}
})

// Store Online Users
export const userSocketMap = {};  // { userId: socketId }

// Socket.io connection handler
// Socket.io connection handler
io.on("connection", (socket)=>{
  const userId = socket.handshake.query.userId;
  console.log("👤 User Connected:", userId, "Socket ID:", socket.id);

  if(userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log("📍 Current online users:", Object.keys(userSocketMap));
    
    // ⭐ IMPORTANT: Emit to ALL clients (including the new one)
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", ()=>{
    console.log("👋 User Disconnected:", userId);
    if(userId && userId !== "undefined") {
      delete userSocketMap[userId];
      console.log("📍 Current online users after disconnect:", Object.keys(userSocketMap));
      
      // ⭐ IMPORTANT: Emit to ALL remaining clients
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  })
})


// Middleware setup
app.use(express.json({limit: '4mb'}));
app.use(cors());

// Routes 
app.use("/api/status", (req,res)=> res.send("server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)
// Database connection - Mongoose
try {
  await connectDB();
  console.log("✅ Database connected successfully");
} catch (error) {
  console.error("❌ Database connection failed:", error.message);
  process.exit(1);
}

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));

