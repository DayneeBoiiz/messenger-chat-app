const prisma = require("../utils/prisma");

const authMiddleware = async (req, res, next) => {
  const sessionID = req.headers.authorization;

  if (!sessionID) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const newSessionID = sessionID.replace("Bearer ", "");

  try {
    // Find the session in the database
    const session = await prisma.session.findUnique({
      where: {
        sessionID: newSessionID,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach the user to the request for future use
    req.user = session.user;

    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = authMiddleware;
