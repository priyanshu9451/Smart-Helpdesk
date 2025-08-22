# 🛠️ Smart Helpdesk

A MERN stack-based helpdesk management system that allows users to register, log in, raise tickets, and track support requests.  
Admins/Support staff can manage tickets, respond to queries, and close issues efficiently.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - JWT-based login & registration
  - Protected routes for authenticated users
- 🎫 **Ticket Management**
  - Users can create, update, and track tickets
  - Admins can assign, respond, and close tickets
- 👤 **User Management**
  - Separate roles for Users and Admins
- 📊 **Dashboard**
  - Overview of open/closed tickets and activity
- 🌐 **Full Stack**
  - **Frontend:** React + Axios
  - **Backend:** Node.js + Express
  - **Database:** MongoDB with Mongoose

---

## 🏗️ Tech Stack

- **Frontend:** React, Tailwind CSS (UI), Axios  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Auth:** JWT (JSON Web Token)  

---

## 📂 Project Structure

```text
Smart-Helpdesk/
│── api/              # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routes
│   │   ├── controllers/  # Business logic
│   │   ├── middlewares/  # Auth & error handling
│   │   └── index.ts      # Server entry point
│── client/           # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js        # Axios instance
│   │   └── App.js
│── .env.example      # Example env variables
│── README.md         # Project docs

---
```

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/smart-helpdesk.git
cd smart-helpdesk
```

2️⃣ Backend Setup
```bash
cd api
npm install
cp .env.example .env   # Add your MongoDB URI & JWT_SECRET
npm run dev
```

3️⃣ Frontend Setup
```bash
cd ../client
npm install
npm start
```

🔑 Environment Variables

Create a .env file inside api/ with the following:

```
PORT=8080
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```



