const express = require("express");
const settingRouter = express.Router();
const prisma = require("../utils/prisma");
const authMiddlware = require("../auth/middleware");

settingRouter.post("/settings/", authMiddlware, async (req, res) => {
  const { name } = req.body;
  const reqUser = req.user;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: reqUser.id,
      },
    });

    if (!user) {
      throw new Error("User not Found");
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: name,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = settingRouter;
