const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/:id/collaborators", collaboratorController.addCollaborator);
router.get("/:id/collaborators", collaboratorController.getCollaborators);
router.delete("/:id/collaborators/:userId", collaboratorController.removeCollaborator);

module.exports = router;