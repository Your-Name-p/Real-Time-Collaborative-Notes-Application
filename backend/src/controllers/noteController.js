const db = require("../config/db");
const logActivity = require("../utils/logActivity");

// ➕ Create Note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const [result] = await db.query(
      "INSERT INTO notes (title, content, owner_id) VALUES (?, ?, ?)",
      [title, content, userId]
    );

    await logActivity(userId, result.insertId, "CREATE_NOTE");

    res.status(201).json({
      message: "Note created successfully",
      noteId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating note" });
  }
};

// 📄 Get All Notes (viewers see all, others see own)
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    console.log('User requesting notes:', { userId, userRole });

    let query, params;

    if (userRole === 'viewer') {
      // Viewers see ALL notes
      query = "SELECT n.*, u.name as owner_name FROM notes n JOIN users u ON n.owner_id = u.id ORDER BY n.updated_at DESC";
      params = [];
    } else {
      // Editors/Admins see only their own notes
      query = "SELECT n.*, u.name as owner_name FROM notes n JOIN users u ON n.owner_id = u.id WHERE n.owner_id = ? ORDER BY n.updated_at DESC";
      params = [userId];
    }

    console.log('Executing query:', query, 'with params:', params);
    const [rows] = await db.query(query, params);
    console.log('Notes found:', rows.length, rows);

    res.json({ notes: rows });
  } catch (err) {
    console.error('getNotes error:', err);
    res.status(500).json({ message: "Server error while fetching notes" });
  }
};

// 🔍 Search Notes
exports.searchNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const [rows] = await db.query(
      `SELECT n.*, u.name as owner_name 
       FROM notes n 
       JOIN users u ON n.owner_id = u.id 
       WHERE (n.owner_id = ? OR n.id IN (
         SELECT note_id FROM collaborators WHERE user_id = ?
       )) AND (n.title LIKE ? OR n.content LIKE ?)
       ORDER BY n.updated_at DESC`,
      [userId, userId, `%${q}%`, `%${q}%`]
    );

    res.json({ notes: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while searching notes" });
  }
};

// 📄 Get Single Note
exports.getNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    let query, params;

    if (userRole === 'viewer') {
      query = "SELECT n.*, u.name as owner_name FROM notes n JOIN users u ON n.owner_id = u.id WHERE n.id = ?";
      params = [noteId];
    } else {
      query = "SELECT n.*, u.name as owner_name FROM notes n JOIN users u ON n.owner_id = u.id WHERE n.id = ? AND n.owner_id = ?";
      params = [noteId, userId];
    }

    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ note: rows[0], collaborators: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching note" });
  }
};

// ✏️ Update Note
exports.updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { title, content } = req.body;

    // Check if user can edit this note
    const [existing] = await db.query(
      `SELECT n.*, c.permission 
       FROM notes n 
       LEFT JOIN collaborators c ON n.id = c.note_id AND c.user_id = ? 
       WHERE n.id = ? AND (n.owner_id = ? OR c.permission = 'editor')`,
      [userId, noteId, userId]
    );

    if (existing.length === 0) {
      return res.status(403).json({ message: "Not authorized to update this note" });
    }

    // Viewers cannot edit
    if (userRole === 'viewer') {
      return res.status(403).json({ message: "Viewers cannot edit notes" });
    }

    await db.query(
      "UPDATE notes SET title = ?, content = ? WHERE id = ?",
      [title, content, noteId]
    );

    await logActivity(userId, noteId, "UPDATE_NOTE");

    res.json({ message: "Note updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating note" });
  }
};

// 🗑️ Delete Note
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Only admins and note owners can delete
    const [existing] = await db.query(
      "SELECT * FROM notes WHERE id = ? AND owner_id = ?",
      [noteId, userId]
    );

    if (existing.length === 0 && userRole !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this note" });
    }

    // If admin but not owner, check if note exists
    if (userRole === 'admin' && existing.length === 0) {
      const [noteExists] = await db.query("SELECT * FROM notes WHERE id = ?", [noteId]);
      if (noteExists.length === 0) {
        return res.status(404).json({ message: "Note not found" });
      }
    }

    await db.query("DELETE FROM notes WHERE id = ?", [noteId]);

    await logActivity(userId, noteId, "DELETE_NOTE");

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting note" });
  }
};