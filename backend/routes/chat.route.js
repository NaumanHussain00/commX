const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/authUser");
const { getChat } = require("../controllers/chat.controller.js");

router.get("/chat/:targetUserId", userAuth, getChat);

module.exports = router;
