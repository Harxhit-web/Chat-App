import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMessage, getUserForSidebar, markMessageSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUserForSidebar);
messageRouter.get("/:id", protectRoute, getMessage);
messageRouter.put("/mark/:id", protectRoute, markMessageSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage)

export default messageRouter;