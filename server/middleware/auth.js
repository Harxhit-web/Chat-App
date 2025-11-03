// middleware is the function that is executed  before executing the  controller function
// -> using middleware we can check if the user is authenticated or not
// middleware to protect routes that require authentication
import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const protectRoute = async (req, res, next) => {
    try{
        // Check multiple possible locations for the token
        const token = req.headers.token || req.headers.authorization?.split(' ')[1] || req.header('token');
        
        console.log("🔍 Token received:", token ? "Yes" : "No");
        console.log("🔍 Headers:", req.headers);
        
        if(!token) {
            return res.json({success: false, message: "No token provided"});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        
        if(!user) {
            return res.json({success: false, message: "User not found"});
        }
        
        req.user = user;
        next();
    } catch(error){
        console.log("❌ Auth middleware error:", error.message);
        return res.json({success: false, message: error.message});
    }
}