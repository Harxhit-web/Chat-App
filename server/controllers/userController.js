import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Signup a new user
export const signup = async(req, res) => {
    const { fullName, email, password, bio } = req.body;
    
    try{
        if(!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details"})
        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email,
            password: hashedPassword,
            bio
        }); await newUser.save();
        const token = generateToken(newUser._id);
        res.json({success: true, userData: newUser, token, message: "Account created successfully"})

    } catch (error) {
        console.log(error.message)
        res.json({success: false,userData: newUser, token, message: error.message})
    }
}

// controller to login a user 
export const login = async(req,res)=> {
    try{
        const {email, password } = req.body;
        const userData = await User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect){
            res.json({success: false, message: "Invalid Credentials"})
        }
        const token = generateToken(userData._id)
        res.json({success: true, userData, token, message: "Login Successful"})
    } catch(error){
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}
// controller to get user is authenticated or not
export const checkAuth = (req, res) =>{
    res.json({success: true, user: req.user});
}

// controller to update user profile details
export const updateProfile = async(req, res) =>{
    try{
        console.log("🔥 Update profile called");
        console.log("Request body:", req.body);
        console.log("User ID:", req.user?._id);


        const{profilePic, bio, fullName} = req.body;
        const userId = req.user._id;

        let updatedUser;

        if(!profilePic){
            console.log("updating user without profle pic...")
            updatedUser = await User.findByIdAndUpdate(
                userId,
                {bio, fullName},
                {new: true, runValidators: true}).select("-password");
                console.log("Updated user (no pic):", updatedUser);
        } else{
            console.log("Uploading image to cloudinary...")
            const upload = await cloudinary.uploader.upload(profilePic);
            console.log("Uploading Image was successful:", upload.secure_url)

            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true, runValidators: true}
            ).select("-password");
            console.log("Updated user (with pic):", updatedUser);

        }
        if(!updatedUser){
            return res.json({success: false, message: "User not found"})
        }
        res.json({success: true, user: updatedUser})
    } catch (error){
        res.json({success: false, message: error.message})
    }
}