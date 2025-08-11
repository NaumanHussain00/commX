const express = require("express");
const router = express.Router();

const { getConnections, getConnectionRequests, getAllUsers } = require("../controllers/user.controller");
const userAuth = require("../middlewares/authUser");

router.get("/user/connections", userAuth, getConnections)
router.get("/request/received", userAuth, getConnectionRequests)
router.get("/users", userAuth, getAllUsers);

module.exports = router;