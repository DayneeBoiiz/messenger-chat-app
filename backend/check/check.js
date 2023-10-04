const express = require("express");
const checkRouter = express.Router();
const prisma = require("../utils/prisma");

checkRouter.post("/check/", async (req, res) => {
  const { sessionIDFromCookie } = req.body;

  if (!sessionIDFromCookie) {
    return res.status(400).json({ error: "Session ID is required." });
  }

  try {
    const session = await prisma.session.findUnique({
      where: {
        sessionID: sessionIDFromCookie,
      },
    });

    if (session) {
      return res.status(200).json({ valid: true });
    } else {
      return res.status(404).json({ valid: false });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = checkRouter;
