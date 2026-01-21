const express = require("express");
const router = express.Router();
const shareController = require("../controllers/shareController");
const authMiddleware = require("../middleware/authMiddleware");

// Owner creates share link
router.post("/notes/:id/share", authMiddleware, shareController.createShareLink);

// Public route
router.get("/share/:token", shareController.getSharedNote);

module.exports = router;