const express = require("express");
const loginRouter = require("./auth/login");
const registerRouter = require("./auth/register");
const bodyParser = require("body-parser");
const cors = require("cors");
const logoutRouter = require("./auth/logout");
const meRouter = require("./users/get_me");
const avatarRouter = require("./users/profile_picture");
const usersRouter = require("./users/get_users");
const conversationRouter = require("./conversations/conversations");
const getConversationRouter = require("./conversations/getConversation");
const otherUserRouter = require("./conversations/get_other_user");
const getConvById = require("./conversations/getConversationById");
const getMessagesRouter = require("./conversations/getMessages");
const messagesRouter = require("./messages/messages");
const seenRouter = require("./conversations/getSeen");
const deleteRouter = require("./conversations/deleteConversation");
const uploadAvatar = require("./avatars/upload");
const authMiddleware = require("./auth/middleware");
const settingRouter = require("./settings/setiings");
const checkRouter = require("./check/check");
const pusherRouter = require("./auth/pusherAuth");

const app = express();

const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(checkRouter);

app.use(avatarRouter);
app.use(loginRouter);
app.use(registerRouter);
app.use(logoutRouter);
app.use(meRouter);
app.use(usersRouter);
app.use(conversationRouter);
app.use(getConversationRouter);
app.use(otherUserRouter);
app.use(getConvById);
app.use(getMessagesRouter);
app.use(messagesRouter);
app.use(seenRouter);
app.use(deleteRouter);
app.use(authMiddleware);
app.use(uploadAvatar);
app.use(settingRouter);
app.use(pusherRouter);

const ip = "localhost";
const PORT = process.env.PORT || 9000;
app.listen(PORT, ip, (error) => {
  if (!error) {
    console.log(`Server runing on ${PORT}`);
  } else {
    console.error("Error occured, Server Couldn't start", error);
  }
});
