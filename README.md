# 💬 Real-Time Chat Application

A modern, full-stack real-time chat application built with the MERN stack, featuring instant messaging, online status tracking, and a beautiful gradient UI.

![Chat App Banner](https://img.shields.io/badge/MERN-Stack-green) ![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-blue) ![Status](https://img.shields.io/badge/Status-Active-success)

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with JWT tokens
- 💬 **Real-Time Messaging** - Instant message delivery using Socket.io
- 🟢 **Online Status** - See who's online in real-time
- 📸 **Image Sharing** - Send and receive images in chats
- 👤 **Profile Management** - Update profile picture and bio
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Beautiful gradient design with Tailwind CSS
- 🔔 **Unseen Message Counter** - Track unread messages per user
- 🖼️ **Media Gallery** - View all shared images in sidebar

## 🚀 Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP requests
- **React Hot Toast** - Notifications
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Dotenv** - Environment variables

## 📁 Project Structure

```
chat-app/
├── client/                  # Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatContainer.jsx
│   │   │   └── RightSidebar.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── context/        # Context API
│   │   │   ├── AuthContext.jsx
│   │   │   └── ChatContext.jsx
│   │   ├── assets/         # Images and static files
│   │   └── App.jsx
│   └── package.json
│
└── server/                  # Backend
    ├── controllers/        # Route controllers
    │   ├── userController.js
    │   └── messageController.js
    ├── models/             # Database models
    │   ├── User.js
    │   └── Message.js
    ├── routes/             # API routes
    │   ├── userRoutes.js
    │   └── messageRoutes.js
    ├── middleware/         # Custom middleware
    │   └── auth.js
    ├── lib/                # Utilities
    │   ├── db.js
    │   ├── cloudinary.js
    │   └── utils.js
    ├── server.js           # Entry point
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for image uploads)

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app/server
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
node server.js
```

### Frontend Setup

1. Navigate to client folder
```bash
cd ../client
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open browser at `https://chat-app-eta-roan.vercel.app/login`

## 🎯 Key Features Explained

### Real-Time Online Status
- Socket.io maintains active connections
- `userSocketMap` object stores userId → socketId mapping
- On connect/disconnect, server broadcasts updated online users array
- Frontend updates UI to show green dot for online users

### Unseen Messages
- Backend counts unseen messages per sender
- Counter displayed as badge on user card in sidebar
- Automatically cleared when user opens chat
- Messages marked as seen in database

### Image Uploads
- Images converted to base64 on frontend
- Uploaded to Cloudinary for CDN storage
- Cloudinary URL stored in MongoDB
- Images displayed in chat and media gallery

### Context API Architecture
- **AuthContext** - Manages authentication, user state, socket connection
- **ChatContext** - Manages messages, users list, selected user
- Provides data to all components without prop drilling

## 🔒 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- Protected routes with authentication middleware
- Input validation on both frontend and backend
- CORS enabled for cross-origin requests

## 🐛 Known Issues & Future Improvements

### To Do
- [ ] Add typing indicators
- [ ] Implement message reactions (like, love, etc.)
- [ ] Add voice message support
- [ ] Group chat functionality
- [ ] Message search feature
- [ ] Dark/Light theme toggle
- [ ] Email verification
- [ ] Password reset functionality
- [ ] File sharing (PDFs, docs)
- [ ] Message encryption

## 👨‍💻 Developer

Created with ❤️ by [Harshit Bhardwaj]

- GitHub: [@Harxhit-web](https://github.com/Harxhit-web)
- LinkedIn: [Harshit Bhardwaj](https://www.linkedin.com/in/harshit-bhardwaj-75691a31b/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For any queries, reach out at: bhardwajharshit931@gmail.com

---

⭐ Star this repo if you found it helpful!
