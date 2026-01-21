const db = require("../config/db");

// ➕ Add Collaborator (only owner)
exports.addCollaborator = async (req, res) => {
  try {
    const { userId, permission } = req.body;
    const noteId = req.params.id;
    const ownerId = req.user.id;

    // Check ownership
    const [note] = await db.query(
      "SELECT * FROM notes WHERE id = ? AND owner_id = ?",
      [noteId, ownerId]
    );

    if (note.length === 0) {
      return res.status(403).json({ message: "Only owner can add collaborators" });
    }

    await db.query(
      "INSERT INTO collaborators (note_id, user_id, permission) VALUES (?, ?, ?)",
      [noteId, userId, permission || "viewer"]
    );

    res.json({ message: "Collaborator added successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "User already collaborator" });
    }
    console.error(err);
    res.status(500).json({ message: "Error adding collaborator" });
  }
};

// 📄 Get Collaborators
exports.getCollaborators = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    // Check access (owner or collaborator)
    const [access] = await db.query(
      `SELECT * FROM notes WHERE id = ? AND owner_id = ?
       UNION
       SELECT n.* FROM notes n
       JOIN collaborators c ON c.note_id = n.id
       WHERE n.id = ? AND c.user_id = ?`,
      [noteId, userId, noteId, userId]
    );

    if (access.length === 0) {
      return res.status(403).json({ message: "No access to this note" });
    }

    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, c.permission
       FROM collaborators c
       JOIN users u ON u.id = c.user_id
       WHERE c.note_id = ?`,
      [noteId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching collaborators" });
  }
};

// ❌ Remove Collaborator (only owner)
exports.removeCollaborator = async (req, res) => {
  try {
    const noteId = req.params.id;
    const collabUserId = req.params.userId;
    const ownerId = req.user.id;

    const [note] = await db.query(
      "SELECT * FROM notes WHERE id = ? AND owner_id = ?",
      [noteId, ownerId]
    );

    if (note.length === 0) {
      return res.status(403).json({ message: "Only owner can remove collaborators" });
    }

    await db.query(
      "DELETE FROM collaborators WHERE note_id = ? AND user_id = ?",
      [noteId, collabUserId]
    );

    res.json({ message: "Collaborator removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing collaborator" });
  }
};