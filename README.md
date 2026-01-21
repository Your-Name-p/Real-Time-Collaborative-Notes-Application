# Real-Time Collaborative Notes Application

A full-stack web application that enables multiple users to create, edit, and collaborate on notes in real-time with secure authentication and role-based permissions.

## 🚀 Features

- **Real-Time Collaboration**: Multiple users can edit notes simultaneously
- **User Authentication**: Secure JWT-based login/registration
- **Role-Based Access**: Admin, Editor, and Viewer permissions
- **Notes Management**: Create, edit, delete, and search notes
- **Live Updates**: WebSocket-powered real-time synchronization
- **Shareable Links**: Generate public read-only links
- **Activity Tracking**: Log all user actions and changes

## 🛠 Tech Stack

**Frontend:**
- React 18 with Vite
- Socket.io Client
- Axios for API calls
- Custom CSS styling

**Backend:**
- Node.js with Express
- Socket.io for WebSockets
- MySQL database
- JWT authentication
- bcrypt password hashing

## 📋 Prerequisites

- Node.js (v16+)
- MySQL (v8+)
- npm or yarn

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Your-Name-p/Real-Time-Collaborative-Notes-Application.git
cd Real-Time-Collaborative-Notes-Application
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=3333
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=realtime_notes_app
JWT_SECRET=your_secret_key
```

Setup database:
```bash
node setup-db.js
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🎯 Usage

1. **Register/Login**: Create account or sign in
2. **Dashboard**: View and manage your notes
3. **Create Notes**: Add new collaborative notes
4. **Real-Time Edit**: Multiple users edit simultaneously
5. **Share**: Generate public links for notes

## 👥 User Roles

- **Admin**: Full access, can delete any notes
- **Editor**: Create and edit own notes
- **Viewer**: Read-only access to all notes

## 🌐 API Endpoints

```
POST /api/auth/register    - User registration
POST /api/auth/login       - User login
GET  /api/notes           - Get all notes
POST /api/notes           - Create note
PUT  /api/notes/:id       - Update note
DELETE /api/notes/:id     - Delete note
```

## 🔧 Configuration

- Backend runs on `http://localhost:3333`
- Frontend runs on `http://localhost:5173`
- Database: MySQL with connection pooling
- WebSocket: Socket.io for real-time features

## 📱 Screenshots

*Dashboard with notes management and real-time collaboration features*

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Live Demo

[Add your deployed application URL here]

---

**Built with ❤️ for real-time collaboration**