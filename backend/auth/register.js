const express = require("express");
const registerRouter = express.Router();
const prisma = require("../utils/prisma");
const Joi = require("joi");
const argon = require("argon2");
const jwt = require("jsonwebtoken");

const registerSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(8).max(24).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
    "string.min": "Password must have at least {#limit} characters",
  }),
});

/**
 * The function generates a JSON Web Token (JWT) with a payload containing the user ID, using a secret
 * key and an expiration time of 1 day.
 * @param userID - The `userID` parameter is the unique identifier of the user for whom the token is
 * being generated. It is used as the payload of the token, which means it will be included in the
 * token's content and can be used to identify the user when the token is decoded.
 * @returns The function `generateToken` returns a JSON Web Token (JWT) that is generated using the
 * `jwt.sign` method.
 */
const generateToken = (userID) => {
  const payload = { userID };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "1d" };

  const token = jwt.sign(payload, secret, options);
  return token;
};

/* The code block you provided is defining a route handler for the HTTP POST request to "/register"
endpoint. */
registerRouter.post("/register", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    const { username, email, password } = value;

    const userExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hash = await argon.hash(password);

    const createdUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        hash: hash,
      },
    });

    res.status(201).json({ message: "Created" });
  }
});

module.exports = registerRouter;
