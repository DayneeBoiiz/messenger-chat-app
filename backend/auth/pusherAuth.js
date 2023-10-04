const express = require("express");
const pusherRouter = express.Router();
const authMiddleware = require("./middleware");
const pusher = require("../utils/pusher");

pusherRouter.post("/pusher/auth/", authMiddleware, async (req, res) => {
  const user = req.user;

  try {
    const channel = req.body.channel_name;
    const socketId = req.body.socket_id;
    const data = {
      user_id: user.email,
    };

    const auth = pusher.authorizeChannel(socketId, channel, data);

    res.send(auth);
  } catch (error) {
    console.error(error);
  }
});

module.exports = pusherRouter;
