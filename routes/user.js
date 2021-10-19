const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const cloudinary = require("cloudinary").v2;

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    const verif = await User.findOne({ email: req.fields.email });
    if (!verif) {
      if (req.fields.username && req.fields.password) {
        const salt = uid2(16);
        const hash = SHA256(salt + req.fields.password).toString(encBase64);
        const token = uid2(64);
        const newUser = new User({
          email: req.fields.email,
          account: {
            username: req.fields.username,
            phone: req.fields.phone,
          },
          token: token,
          hash: hash,
          salt: salt,
        });
        if (req.files.picture) {
          const imgUploaded = await cloudinary.uploader.upload(
            req.files.picture.path,
            {
              folder: `/vinted/users/${newUser._id}`,
            }
          );
          newUser.account.avatar = imgUploaded;
        }

        await newUser.save();
        res.status(200).json({
          _id: newUser._id,
          token: newUser.token,
          account: newUser.account,
        });
      } else {
        res.status(400).json({
          error: {
            message: "You have to enter your username and your password.",
          },
        });
      }
    } else {
      res.status(409).json({
        error: { message: "An account with this email already exists." },
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const thisUser = await User.findOne({ email: req.fields.email });
    if (thisUser) {
      const newHash = SHA256(thisUser.salt + req.fields.password).toString(
        encBase64
      );
      if (newHash === thisUser.hash) {
        res.status(200).json({
          _id: thisUser.id,
          token: thisUser.token,
          account: thisUser.account,
        });
      } else {
        res.status(401).json({ error: { message: "Unauthorized." } });
      }
    } else {
      res.status(400).json({ error: { message: "User not found" } });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
