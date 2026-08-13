# 🎓 Student Management System

A full-stack **Student Management System** built using React, Node.js, Express.js, SQLite, and JWT authentication.

The application provides a modern dashboard for managing student records, viewing statistics, filtering data, exporting reports, and securely accessing the system through admin authentication.

---

## ✨ Features

### 🔐 Authentication
- Admin Login
- JWT-based authentication
- Protected routes
- Protected backend APIs
- Automatic handling of expired/invalid tokens
- Secure password hashing

### 👨‍🎓 Student Management
- Add new students
- View all students
- Edit student details
- Delete students
- Persistent student records using SQLite
- Form validation

### 🔍 Search & Filters
- Search students by name, email, phone, or course
- Filter by gender
- Filter by course
- Filter by semester
- Clear all filters

### 📊 Dashboard & Analytics
- Total Students
- Male Students
- Female Students
- Total Courses
- Student statistics cards
- Animated counters
- Gender distribution chart
- Students-per-course chart

### 📄 Reports & Export
- Export student records to Excel
- Export student records to PDF

### 📑 Data Display
- Responsive student table
- Pagination
- Gender badges
- First / Previous / Next / Last navigation
- Dynamic record count

### 🔔 User Experience
- Toast notifications
- Responsive interface
- Loading/error handling
- Form validation
- Clean dashboard layout

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router
- React Hook Form
- Zod
- React Hot Toast
- Recharts
- React Icons
- React CountUp
- jsPDF
- SheetJS (XLSX)

### Backend
- Node.js
- Express.js
- SQLite
- better-sqlite3
- JWT (JSON Web Token)
- bcrypt
- CORS
- dotenv

---

## 📁 Project Structure

```text
student-management-system/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── charts/
│       │   ├── dashboard/
│       │   ├── layout/
│       │   └── students/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── validation/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd student-management-system
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> Never commit your `.env` file or JWT secret to GitHub.

### 4. Start the backend

```bash
node index.js
```

The backend runs on:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Start the frontend

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🔒 Security

- Passwords are stored as hashes rather than plain text.
- JWT authentication protects private API endpoints.
- Protected frontend routes prevent unauthorized dashboard access.
- Environment variables are excluded from Git.
- SQLite database files containing application data are excluded from Git.

---

## 🚀 Deployment

The project is being prepared for deployment using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** SQLite with persistent storage

---

## 📸 Screenshots

Screenshots of the login page, dashboard, analytics, and student management interface will be added here.

---

## 🔮 Planned Features

- Admin profile and logout header
- Role-based access control
- Teacher management
- Course management
- Attendance management
- Marks management
- Reports
- Dark mode
- Enhanced dashboard UI
- Additional analytics

---

## 👨‍💻 Author

**Sagar Bhojwani**

GitHub: `Sagar_Coder2008`

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐.