const express = require("express");
const meRouter = express.Router();
const prisma = require("../utils/prisma");
const authMiddleware = require("../auth/middleware");

meRouter.get("/users/me", authMiddleware, async (req, res) => {
  try {
    const sessionID = req.headers.authorization.replace("Bearer ", "");

    const session = await prisma.session.findUnique({
      where: {
        sessionID: sessionID,
      },
    });

    if (session) {
      const userID = session.userID;

      const user = await prisma.user.findUnique({
        where: {
          id: userID,
        },
      });

      if (user) {
        const userInfo = {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          avatarPicture: user.avatarPicture,
        };

        return res.status(200).json(userInfo);
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } else {
      return res.status(404).json({ error: "Session not found" });
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = meRouter;
