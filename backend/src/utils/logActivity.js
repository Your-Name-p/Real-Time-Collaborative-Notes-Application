const db = require("../config/db");

module.exports = async function logActivity(userId, noteId, action) {
  try {
    await db.query(
      "INSERT INTO activity_logs (user_id, note_id, action) VALUES (?, ?, ?)",
      [userId, noteId, action]
    );
  } catch (err) {
    console.error("Activity log error:", err);
  }
};