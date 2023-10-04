const express = require("express");
const conversationRouter = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../auth/middleware");
const { v4: uuidv4 } = require("uuid");
const pusher = require("../utils/pusher");

conversationRouter.post("/conversations", authMiddleware, async (req, res) => {
  try {
    const { userID, isGroup, members, name } = req.body;
    const currentUser = req.user;

    if (isGroup && (!members || members.length < 2 || !name)) {
      return res.status(400).json({ error: "Invalid Data" });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name: name,
          isGroup: true,
          users: {
            connect: [
              ...members.map((member) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
          uid: uuidv4(),
        },
        include: {
          users: true,
        },
      });

      newConversation.users.forEach((user) => {
        if (user.email) {
          pusher.trigger(user.email, "conversation:new", newConversation);
        }
      });

      return res.status(201).json(newConversation);
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { users: { some: { id: userID } } },
          {
            users: { some: { id: currentUser.id } },
          },
        ],
        isGroup: null,
      },
      include: {
        users: true,
        message: true,
      },
    });

    if (existingConversation) {
      return res.status(201).json(existingConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userID,
            },
          ],
        },
        uid: uuidv4(),
      },
      include: {
        users: true,
      },
    });

    newConversation.users.map((user) => {
      if (user.email) {
        pusher.trigger(user.email, "conversation:new", newConversation);
      }
    });

    return res.status(201).json(newConversation);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error while creating the conversation ${error}` });
  }
});

module.exports = conversationRouter;
