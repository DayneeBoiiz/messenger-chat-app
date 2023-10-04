const express = require("express");
const seenRouter = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../auth/middleware");
const pusher = require("../utils/pusher");

seenRouter.post(
  "/conversations/:conversationId/seen",
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
          message: {
            include: {
              seen: true,
            },
          },
          users: true,
        },
      });

      if (!conversation) {
        return res.status(400).json("Invalid ID");
      }

      const lastMessage = conversation.message[conversation.message.length - 1];

      if (!lastMessage) {
        return res.status(201).json(conversation);
      }

      const updatedMessage = await prisma.message.update({
        where: {
          id: lastMessage.id,
        },
        include: {
          sender: true,
          seen: true,
        },
        data: {
          seen: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await pusher.trigger(user.email, "conversation:update", {
        uid: conversationId,
        message: [updatedMessage],
      });

      if (lastMessage.seen.indexOf(user.id) !== -1) {
        res.status(201).json(conversation);
      }

      await pusher.trigger(conversationId, "message:update", updatedMessage);

      return res.status(201).json(updatedMessage);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = seenRouter;
