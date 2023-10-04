const express = require("express");
const getConversationRouter = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../auth/middleware");

getConversationRouter.get(
  "/conversations/getconversation/",
  authMiddleware,
  async (req, res) => {
    const user = req.user;

    const conversation = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        users: true,
        message: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    res.status(201).json(conversation);
  }
);

module.exports = getConversationRouter;
