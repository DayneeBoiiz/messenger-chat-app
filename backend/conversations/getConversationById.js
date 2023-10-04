const express = require("express");
const getConvById = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../auth/middleware");

getConvById.get(
  "/conversations/:conversationID/",
  authMiddleware,
  async (req, res) => {
    const { conversationID } = req.params;

    try {
      const conversation = await prisma.conversation.findUnique({
        where: {
          uid: conversationID,
        },
        include: {
          users: true,
        },
      });

      res.status(201).json(conversation);
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  }
);

module.exports = getConvById;
