const express = require("express");
const loginRouter = express.Router();
const prisma = require("../utils/prisma");
const Joi = require("joi");
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .messages({
      "string.base": "Email must be a string",
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
      "string.email": "Email format is incorrect",
    })
    .required(),
  password: Joi.string().required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
    "string.min": "Password must have at least {#limit} characters",
  }),
});

const generateToken = (userID) => {
  const payload = { userID };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "1d" };

  const token = jwt.sign(payload, secret, options);
  return token;
};

loginRouter.post("/login", async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  } else {
    const { email, password } = value;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await argon.verify(user.hash, password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    try {
      const existingSession = await prisma.session.findUnique({
        where: {
          userID: user.id,
        },
      });

      if (existingSession) {
        return res
          .status(200)
          .json({ sessionID: existingSession.sessionID, user: user });
      }

      const sessionID = uuidv4();
      const session = await prisma.session.create({
        data: {
          sessionID: sessionID,
          userID: user.id,
        },
      });

      res.cookie("sessionID", session.sessionID, {
        domain: `10.30.163.120`,
        path: "/",
        maxAge: 86400000,
        sameSite: "strict",
      });

      return res.status(201).json({ sessionID: session.sessionID, user: user });
    } catch (error) {
      console.error("Error creating session:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

module.exports = loginRouter;
