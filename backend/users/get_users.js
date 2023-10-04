const express = require("express");
const usersRouter = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../auth/middleware");
const { hash } = require("argon2");

usersRouter.get("/users/all", authMiddleware, async (req, res) => {
  const userID = req.user.id;

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      NOT: {
        id: userID,
      },
    },
  });

  res
    .status(200)
    .json({ users: users.map(({ hash, avatarPicture, ...rest }) => rest) });
});

module.exports = usersRouter;
