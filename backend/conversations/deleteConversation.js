const express = require("express");
const deleteRouter = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../auth/middleware");
const pusher = require("../utils/pusher");

deleteRouter.delete(
  "/conversations/:conversationId/delete",
  authMiddleware,
  async (req, res) => {
    const { conversationId } = req.params;
    const user = req.user;

    try {
      const conversation = await prisma.conversation.findUnique({
        where: {
          uid: conversationId,
        },
        include: {
          users: true,
          message: true,
        },
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Disconnect users from the conversation
      await prisma.conversation.update({
        where: {
          uid: conversationId,
        },
        data: {
          users: {
            disconnect: conversation.users.map((user) => ({ id: user.id })),
          },
        },
      });

      // Delete all messages associated with the conversation
      await prisma.message.deleteMany({
        where: {
          conversationID: conversation.uid,
        },
      });

      // Delete the conversation itself
      await prisma.conversation.delete({
        where: {
          uid: conversationId,
        },
      });

      conversation.users.forEach((user) => {
        if (user.email)
          pusher.trigger(user.email, "conversation:remove", conversation);
      });

      return res.status(201).json(conversation);
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports = deleteRouter;
