const express = require("express");
const logoutRouter = express.Router();
const prisma = require("../utils/prisma");

logoutRouter.post("/logout", async (req, res) => {
  try {
    const { sessionID } = req.body;

    const session = await prisma.session.findUnique({
      where: {
        sessionID: sessionID,
      },
    });

    if (session) {
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });

      res.clearCookie("sessionID");
      return res.status(200).json({ message: "Logout successful" });
    } else {
      return res.status(404).json({ error: "Session not found" });
    }
  } catch (error) {
    console.error("Error loggin out : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = logoutRouter;
