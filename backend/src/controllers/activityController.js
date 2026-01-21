const db = require("../config/db");

// Get logs for user's notes
exports.getActivityLogs = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT al.id, al.action, al.created_at, n.title, u.name AS user_name
       FROM activity_logs al
       JOIN notes n ON n.id = al.note_id
       JOIN users u ON u.id = al.user_id
       WHERE n.owner_id = ?
       ORDER BY al.created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching activity logs" });
  }
};