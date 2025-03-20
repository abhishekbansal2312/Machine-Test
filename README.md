# 🚀 MERN Stack Lead Distribution System

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4-green)
![Express](https://img.shields.io/badge/Express-4.18.2-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node](https://img.shields.io/badge/Node-18.x-green)

## 📋 Overview

A comprehensive application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) designed to manage agents and distribute leads efficiently. This system allows admin users to create and manage agents, upload CSV files containing lead information, and automatically distribute leads among agents.

## ✨ Features

- 🔐 **User Authentication**

  - Secure admin login with JWT authentication
  - Protected routes and API endpoints

- 👥 **Agent Management**

  - Create, read, update, and delete agents
  - Store comprehensive agent information including name, email, and contact details

- 📊 **Lead Distribution**
  - Upload CSV/XLSX files containing lead information
  - Automatic and equal distribution of leads to registered agents
  - View lead distribution status and assignments

## 🔧 Technology Stack

- **Frontend**: React.js with context API for state management
- **Backend**: Express.js & Node.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Processing**: CSV/XLSX parsing and validation

## 📦 Installation

### Prerequisites

- Node.js (v18.x or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

#### 1. Clone the repository

```bash
git clone https://github.com/abhishekbansal2312/Machine-Test.git
cd lead-distribution-system
```

#### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file with the following variables
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# PORT=5004

# Start the server
npm start
```

#### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🌐 Application Structure

### Backend Structure

```
server/
├── config/         # Database configuration
├── controllers/    # Route controllers
├── middleware/     # Custom middleware (auth, validation)
├── models/         # MongoDB schemas
├── routes/         # API routes
├── uploads/        # Temporary file storage
├── utils/          # Helper functions
└── server.js       # Entry point
```

### Frontend Structure

```
client/
├── public/         # Static files
├── src/
│   ├── api/        # API integration
│   ├── assets/     # Images and static resources
│   ├── components/ # Reusable components
│   ├── context/    # Context API for state management
│   ├── pages/      # Page components
│   └── utils/      # Helper functions
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## 🔍 API Documentation

### Authentication APIs

#### Register Admin User

- **Method**: POST
- **Endpoint**: `/api/auth/register`
- **Body**: `{ email, password }`

#### Login

- **Method**: POST
- **Endpoint**: `/api/auth/login`
- **Body**: `{ email, password }`

### Agent APIs

#### Create Agent

- **Method**: POST
- **Endpoint**: `/api/agents`
- **Body**: `{ name, email, mobile, password }`
- **Auth**: Required

#### Get All Agents

- **Method**: GET
- **Endpoint**: `/api/agents`
- **Auth**: Required

#### Get Agent by ID

- **Method**: GET
- **Endpoint**: `/api/agents/:id`
- **Auth**: Required

#### Update Agent

- **Method**: PUT
- **Endpoint**: `/api/agents/:id`
- **Body**: `{ name, email, mobile }`
- **Auth**: Required

#### Delete Agent

- **Method**: DELETE
- **Endpoint**: `/api/agents/:id`
- **Auth**: Required

### List APIs

#### Upload and Distribute List

- **Method**: POST
- **Endpoint**: `/api/lists/upload`
- **Body**: FormData with CSV file
- **Auth**: Required

#### Get Lists by Agent ID

- **Method**: GET
- **Endpoint**: `/api/lists/agent/:id`
- **Auth**: Required

#### Get All Lists

- **Method**: GET
- **Endpoint**: `/api/lists`
- **Auth**: Required

## 📋 Testing

A comprehensive Postman collection has been created for testing all API endpoints. Please refer to the included documentation for detailed information about request parameters and expected responses.

## 📝 Usage Guide

### Admin Login

1. Navigate to the login page
2. Enter your admin credentials
3. Upon successful authentication, you'll be redirected to the dashboard

### Managing Agents

1. From the dashboard, navigate to the "Agents" section
2. Use the form to add new agents
3. View, edit, or delete existing agents from the list

### Uploading and Distributing Leads

1. Navigate to the "List Management" section
2. Upload a CSV file containing lead information
3. The system will automatically distribute leads among agents
4. View the distribution results and assignments

## 🚧 Error Handling

The application includes comprehensive error handling:

- Input validation for all forms
- Appropriate error messages for API failures
- Authentication verification
- File format validation

## 🔒 Security Features

- Password hashing using bcrypt
- JWT authentication for protected routes
- Secure HTTP-only cookies
- Input sanitization to prevent injection attacks

## 📜 License

This project is [MIT](LICENSE) licensed.

⭐️ Made with ❤️ using the MERN stack!
