const express = require("express");
const getMessagesRouter = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../auth/middleware");

getMessagesRouter.get(
  "/conversations/:conversationID/messages/",
  authMiddleware,
  async (req, res) => {
    const { conversationID } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        conversationID: conversationID,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(201).json(messages);
  }
);

module.exports = getMessagesRouter;
