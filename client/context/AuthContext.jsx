import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [token, setToken] = useState(() => {
        const savedToken = localStorage.getItem("token");
        console.log("🔧 Initializing token from localStorage:", savedToken ? "Found" : "Not found");
        return savedToken;
    });
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    //  Check if user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        try{
            console.log("Checking auth...");
            const { data } = await axios.get("/api/auth/check");
            console.log("Auth check response:", data);
            if (data.success){
                setAuthUser(data.user);
                connectSocket(data.user);
            } else {
                // If auth check fails, clear token
                console.log("Auth check failed, clearing token");
                localStorage.removeItem("token");
                setToken(null);
                setAuthUser(null);
            }
        } catch (error) {
            console.error("Auth check error:", error);
            console.error("Error response:", error.response?.data);
            // Clear invalid token only on authentication errors
            if(error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem("token");
                setToken(null);
                setAuthUser(null);
            }
            // Don't show toast on page load/refresh
        }
    }

    // Login function to handle user authentication and socket connection
    const login = async(state, credentials) => {
        try{
            console.log("Attempting login with state:", state);
            console.log("Credentials:", { ...credentials, password: "***" });
            
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            console.log("Login response:", data);
            
            if(data.success){
                const user = data.userData || data.user;
                const userToken = data.token;
                
                // Set everything in correct order
                setAuthUser(user);
                setToken(userToken);
                localStorage.setItem("token", userToken);
                axios.defaults.headers.common["token"] = userToken;
                
                console.log("✅ Token saved to localStorage:", userToken);
                
                connectSocket(user);
                toast.success(data.message || "Login successful");
            } else{
                toast.error(data.message || "Login failed");
            }
        } catch(error){
            console.error("Login error:", error);
            console.error("Error response:", error.response?.data);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    // Logout function to handle user logout and socket disconnection
    const logout = async() => {
        try {
            localStorage.removeItem("token");
            setToken(null);
            setAuthUser(null);
            setOnlineUsers([]);
            axios.defaults.headers.common["token"] = null;
            if(socket?.connected) {
                socket.disconnect();
            }
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    // Update profile function to handle user profile updates
    const updateProfile = async (body) => {
        try{
            console.log("Updating profile with data:", body);
            const response = await axios.put("/api/auth/update-profile", body);
            console.log("Update response:", response.data);
            const { data } = response;
            
            if(data.success){
                setAuthUser(data.user);
                toast.success(data.message || "Profile updated successfully");
                return true;
            } else {
                toast.error(data.message || "Update failed");
                return false;
            }
        }catch(error){
            console.error("Update profile error:", error);
            console.error("Error details:", error.response);
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    }

    // Connect socket function to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if(!userData) return;
        
        // If socket already exists and is connected, don't create a new one
        if(socket?.connected) {
            console.log("⚠️ Socket already connected, skipping...");
            return;
        }
        
        console.log("🔌 Connecting socket for user:", userData._id);
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("✅ Socket connected:", newSocket.id);
        });

        newSocket.on("getOnlineUsers", (userIds)=>{
            console.log("📡 Received online users:", userIds);
            setOnlineUsers(userIds);
        });

        newSocket.on("connect_error", (error) => {
            console.error("❌ Socket connection error:", error);
        });

        newSocket.on("disconnect", (reason) => {
            console.log("🔌 Socket disconnected:", reason);
        });

        newSocket.on("reconnect", (attemptNumber) => {
            console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
        });
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
    }, []);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}