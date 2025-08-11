const express = require("express");
const {
  profileView,
  profileEdit,
} = require("../controllers/profile.controller.js");
const router = express.Router();
const authUser = require("../middlewares/authUser");

router.get("/profile/view", authUser, profileView);
router.post("/profile/edit", authUser, profileEdit);

module.exports = router;
