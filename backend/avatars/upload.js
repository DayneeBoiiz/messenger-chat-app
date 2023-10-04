const express = require("express");
const uploadAvatar = express.Router();
const prisma = require("../utils/prisma");
const authMiddlware = require("../auth/middleware");
const multer = require("multer");
const path = require("path");

const configureStorage = (authMiddlware) => {
  return multer.diskStorage({
    destination: path.join(__dirname, "./"),
    filename: (req, file, callback) => {
      const userId = req.user.id;
      const username = req.user.username;
      const fileExtension = path.extname(file.originalname);
      const newFilename = `${userId}_${username}${fileExtension}`;
      callback(null, newFilename);
    },
  });
};

const upload = multer({ storage: configureStorage(authMiddlware) });

uploadAvatar.post(
  "/avatar/upload/",
  upload.single("image"),
  authMiddlware,
  async (req, res) => {
    try {
      const user = req.user;
      const newAvatarFilename = req.file.filename;

      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          avatarPicture: newAvatarFilename,
        },
      });

      res.json({ message: "Avatar uploaded successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: "Error uploading avatar" });
    }
  }
);

module.exports = uploadAvatar;
