const express = require("express");
const messagesRouter = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../auth/middleware");
const pusher = require("../utils/pusher");

messagesRouter.post("/messages/", authMiddleware, async (req, res) => {
  const { conversationId, message, image } = req.body;
  const user = req.user;

  const newMessage = await prisma.message.create({
    data: {
      body: message,
      image: image,
      conversation: {
        connect: {
          uid: conversationId,
        },
      },
      sender: {
        connect: {
          id: user.id,
        },
      },
      seen: {
        connect: {
          id: user.id,
        },
      },
    },
    include: {
      seen: true,
      sender: true,
    },
  });

  const updatedConversation = await prisma.conversation.update({
    where: {
      uid: conversationId,
    },
    data: {
      lastMessageAt: new Date(),
      message: {
        connect: {
          id: newMessage.id,
        },
      },
    },
    include: {
      users: true,
      message: {
        include: {
          seen: true,
        },
      },
    },
  });

  await pusher.trigger(conversationId, "message:new", newMessage);

  const lastMessage =
    updatedConversation.message[updatedConversation.message.length - 1];

  updatedConversation.users.map((user) => {
    pusher.trigger(user.email, "conversation:update", {
      uid: updatedConversation.uid,
      message: [lastMessage],
    });
  });

  return res.status(201).json(newMessage);
});

module.exports = messagesRouter;
