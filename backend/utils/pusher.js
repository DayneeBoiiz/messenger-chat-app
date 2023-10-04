const PusherServer = require("pusher");

const pusher = new PusherServer({
  appId: process.env.app_id,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true,
});

module.exports = pusher;
