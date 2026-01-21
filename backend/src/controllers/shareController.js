const db = require("../config/db");
const generateToken = require("../utils/generateToken");
const logActivity = require("../utils/logActivity");

// ➕ Create Share Link (only owner)
exports.createShareLink = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    // Ownership check
    const [note] = await db.query(
      "SELECT * FROM notes WHERE id = ? AND owner_id = ?",
      [noteId, userId]
    );

    if (note.length === 0) {
      return res.status(403).json({ message: "Only owner can share this note" });
    }

    const token = generateToken();

    await db.query(
      "INSERT INTO shared_links (note_id, token) VALUES (?, ?)",
      [noteId, token]
    );

    await logActivity(userId, noteId, "SHARE_NOTE");

    res.json({
      message: "Share link created",
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/share/${token}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating share link" });
  }
};

// 🌍 Public Read-Only Access
exports.getSharedNote = async (req, res) => {
  try {
    const token = req.params.token;

    const [rows] = await db.query(
      `SELECT n.id, n.title, n.content, n.updated_at
       FROM shared_links s
       JOIN notes n ON n.id = s.note_id
       WHERE s.token = ?`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching shared note" });
  }
};