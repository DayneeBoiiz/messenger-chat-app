const express = require("express");
const avatarRouter = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../auth/middleware");

avatarRouter.get(
  "/users/:username/avatar",
  authMiddleware,
  async (req, res) => {
    try {
      const username = req.params.username;

      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const avatarPicture = user.avatarPicture;

      return res.sendFile(
        `/home/dayneeboiiz/Desktop/chat-app/backend/avatars/${avatarPicture}`
      );
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = avatarRouter;
