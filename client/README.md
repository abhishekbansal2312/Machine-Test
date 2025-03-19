# MERN Task Manager

A full-stack application for managing agents and distributing task lists, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Admin User Authentication**: Secure login system with JWT authentication
- **Agent Management**: Add, edit, and delete agents
- **List Management**: Upload CSV/Excel files and automatically distribute tasks among agents
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- React.js
- React Router for navigation
- React Bootstrap for UI components
- Axios for API requests

### Backend

- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Multer for file uploads

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Setup Instructions

1. **Clone the repository**

   ```
   git clone https://github.com/yourusername/mern-task-manager.git
   cd mern-task-manager
   ```

2. **Install backend dependencies**

   ```
   cd server
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the server directory with the following variables:

   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mern-task-manager
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Install frontend dependencies**

   ```
   cd ../client
   npm install
   ```

5. **Start the development servers**

   For backend:

   ```
   cd ../server
   npm run dev
   ```

   For frontend:

   ```
   cd ../client
   npm start
   ```

6. **Access the application**
   Open your browser and go to `http://localhost:3000`

## Usage

### Admin Login

- Use the login page to access the admin dashboard
- Default admin credentials:
  - Email: admin@example.com
  - Password: admin123

### Managing Agents

1. Navigate to the Agents page
2. Use the "Add New Agent" button to create agents
3. Edit or delete existing agents as needed

### Uploading and Distributing Lists

1. Navigate to the Lists page
2. Upload a CSV or Excel file (must include FirstName, Phone, and Notes columns)
3. The system will automatically distribute the items equally among all agents
4. View the distributed lists by selecting each agent tab

## API Endpoints

### Authentication

- `POST /api/auth/login`: Login with email and password
- `POST /api/auth/register`: Register a new admin user

### Agents

- `GET /api/agents`: Get all agents
- `POST /api/agents`: Create a new agent
- `GET /api/agents/:id`: Get agent by ID
- `PUT /api/agents/:id`: Update agent
- `DELETE /api/agents/:id`: Delete agent

### Lists

- `POST /api/lists/upload`: Upload and distribute a list
- `GET /api/lists/agent/:agentId`: Get lists assigned to a specific agent
- `GET /api/lists`: Get all lists

## License

MIT
