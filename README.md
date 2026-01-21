# Real-Time Collaborative Notes Application

A production-quality full-stack web application that allows multiple users to create, edit, and collaborate on notes in real time with secure authentication, role-based access control, and activity tracking.

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel/Netlify]
- **Backend**: [Deployed on Railway/Render]

## 📋 Features

### ✅ Core Functionality
- **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access (Admin, Editor, Viewer)
  - API-level access restrictions

- **Notes Management**
  - Create, edit, delete notes
  - Ownership and timestamps
  - Collaborator management with permissions

- **Real-Time Collaboration**
  - Live editing with multiple users
  - WebSocket-based real-time sync (Socket.io)
  - Conflict handling and update awareness

- **Activity Logging**
  - Track all user actions (create, update, delete, share)
  - Timestamp and user reference tracking

- **Search Functionality**
  - Search notes by title and content
  - Permission-based search results

- **Shareable Links**
  - Public read-only links without login
  - Secure token-based sharing

## 🛠 Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Router** - Navigation
- **Custom CSS** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Socket.io** - WebSocket server
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor', 'viewer') DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  owner_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Collaborators table
CREATE TABLE collaborators (
  id INT PRIMARY KEY AUTO_INCREMENT,
  note_id INT NOT NULL,
  user_id INT NOT NULL,
  permission ENUM('editor', 'viewer') DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_collab (note_id, user_id),
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Activity logs table
CREATE TABLE activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  note_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);

-- Shared links table
CREATE TABLE shared_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  note_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL (v8+)
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd notes-app/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Create `.env` file in backend directory:
```env
PORT=3333
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=realtime_notes_app
JWT_SECRET=your_super_secret_jwt_key
```

4. **Database Setup**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE realtime_notes_app;"

# Import schema
mysql -u root -p realtime_notes_app < schema.sql
```

5. **Start Backend Server**
```bash
npm start
# or for development
npm run dev
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Create `.env` file in frontend directory:
```env
VITE_BACKEND_URL=http://localhost:3333
```

4. **Start Frontend Server**
```bash
npm run dev
```

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "editor"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/profile`
Get user profile (requires JWT token)

### Notes Endpoints

#### GET `/api/notes`
Get all user notes (with optional search)
- Query params: `?search=keyword`

#### POST `/api/notes`
Create new note
```json
{
  "title": "My Note",
  "content": "Note content here"
}
```

#### GET `/api/notes/:id`
Get specific note with collaborators

#### PUT `/api/notes/:id`
Update note
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### DELETE `/api/notes/:id`
Delete note

#### GET `/api/notes/search?q=keyword`
Search notes by title/content

### Collaboration Endpoints

#### POST `/api/notes/:id/collaborators`
Add collaborator
```json
{
  "email": "collaborator@example.com",
  "permission": "editor"
}
```

#### GET `/api/notes/:id/collaborators`
Get note collaborators

#### DELETE `/api/notes/:noteId/collaborators/:userId`
Remove collaborator

### Sharing Endpoints

#### POST `/api/share/:noteId`
Generate shareable link

#### GET `/api/share/:token`
Access shared note (public)

### Activity Endpoints

#### GET `/api/activity/:noteId`
Get note activity log

## 🔌 WebSocket Events

### Client → Server
- `join-note` - Join note room for real-time updates
- `edit-note` - Send note content changes

### Server → Client
- `note-updated` - Receive real-time note updates
- `user-joined` - User joined note session
- `user-left` - User left note session

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express API    │◄──►│   MySQL DB      │
│                 │    │                 │    │                 │
│ - Authentication│    │ - JWT Auth      │    │ - Users         │
│ - Real-time UI  │    │ - REST APIs     │    │ - Notes         │
│ - Socket.io     │    │ - Socket.io     │    │ - Collaborators │
└─────────────────┘    │ - Role-based    │    │ - Activity Logs │
                       │   Access        │    │ - Shared Links  │
                       └─────────────────┘    └─────────────────┘
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Role-based Access** - Admin/Editor/Viewer permissions
- **Input Validation** - Server-side validation
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Cross-origin request handling

## 🚀 Deployment

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy from main branch

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy from main branch

### Environment Variables for Production
```env
# Backend
PORT=3333
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=realtime_notes_app
JWT_SECRET=your_production_jwt_secret

# Frontend
VITE_BACKEND_URL=https://your-backend-url.com
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration/login
- [ ] Create/edit/delete notes
- [ ] Real-time collaboration
- [ ] Search functionality
- [ ] Share links
- [ ] Role-based permissions
- [ ] Activity logging

### API Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Test login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 📝 Development Notes

### Code Structure
- **Backend**: MVC pattern with controllers, routes, middleware
- **Frontend**: Component-based React architecture
- **Database**: Normalized relational schema
- **Real-time**: Socket.io rooms for note collaboration

### Key Design Decisions
- JWT for stateless authentication
- MySQL for ACID compliance
- Socket.io for real-time features
- Role-based permissions at API level
- Token-based public sharing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: [Your Name]
- **Contact**: [Your Email]

---

**Built with ❤️ for real-time collaboration**