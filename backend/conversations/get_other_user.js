const express = require("express");
const otherUserRouter = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../auth/middleware");

otherUserRouter.get(
  "/conversations/:conversationUuid/otherUser/",
  authMiddleware,
  async (req, res) => {
    const conversationUuid = req.params.conversationUuid;
    const userID = req.user.id;

    try {
      const conversation = await prisma.conversation.findUnique({
        where: {
          uid: conversationUuid,
        },
        include: {
          users: true,
        },
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const otherUser = conversation.users.find((user) => user.id !== userID);

      if (!otherUser) {
        return res
          .status(404)
          .json({ error: "Other user not found in the conversation" });
      }

      delete otherUser.hash;

      res.json(otherUser);
    } catch (error) {
      res.status(500).json({ error: "Error fetching the other user" });
    }
  }
);

module.exports = otherUserRouter;
