# Backend Only Repository

This is the backend service for the Real-Time Collaborative Notes Application.

## Deploy to Railway

1. Fork this repository
2. Connect to Railway
3. Add MySQL service
4. Set environment variables:
   - `DB_HOST`
   - `DB_USER` 
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET`
   - `PORT` (Railway sets this automatically)

## Environment Variables

```
PORT=3333
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=realtime_notes_app
JWT_SECRET=your_secret_key
```