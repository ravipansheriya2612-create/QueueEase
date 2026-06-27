# QueueEase

A modern **MERN Stack Hospital Queue Management System** that enables patients to generate digital queue tokens while allowing hospital administrators to manage departments and patient queues in real time.

## 🚀 Live Demo

**Frontend:** https://queueease-frontend.onrender.com

**Backend API:** https://queueease-backend-20e9.onrender.com

## ✨ Features

### 👨‍⚕️ Patient

* Register & Login
* JWT Authentication
* View Hospital Departments
* Generate Digital Queue Token
* Live Queue Tracking
* Cancel Token
* Responsive UI

### 🏥 Admin

* Admin Dashboard
* Create Department
* Manage Departments
* Call Next Patient
* Skip Current Token
* Complete Token
* Real-Time Queue Updates

### ⚡ Real-Time

* Socket.IO Integration
* Live Queue Synchronization
* Instant Queue Updates

## 🛠 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios
* React Hot Toast
* Socket.IO Client
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Socket.IO
* Twilio SMS API

## 📂 Project Structure

```
QueueEase
│
├── Frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── Backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── server.js
│
└── README.md
```

## ⚙️ Installation

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## 🔐 Environment Variables

Create a `.env` file inside the Backend folder.

```
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

TWILIO_ACCOUNT_SID=your_account_sid

TWILIO_AUTH_TOKEN=your_auth_token

TWILIO_PHONE_NUMBER=your_twilio_number
```

Create a `.env` file inside the Frontend folder.

```
VITE_API_URL=http://localhost:5000/api

VITE_SOCKET_URL=http://localhost:5000
```

## 📸 Screenshots

Add screenshots of:

* Home Page
* Login
* Register
* Dashboard
* Live Queue
* Admin Dashboard
* Create Department
* Manage Queue

## Future Improvements

* Email Notifications
* QR Code Token
* Estimated Waiting Time
* Queue Analytics
* Appointment Booking
* Doctor Management
* Patient History
* Multi Hospital Support

## Author

**Ravi Pansheriya**

GitHub: https://github.com/ravipansheriya2612-create
