const express = require("express");
const {
  connectionRequest,
  getConnectionRequests,
  acceptOrRejectConnectionRequests,
} = require("../controllers/connectionRequest.controller");

const userAuth = require("../middlewares/authUser");
const router = express.Router();

// api route to send connection request
router.post("/send/:status/:toUserId", userAuth, connectionRequest);

// api route to get all the pending connection requests of the user
// router.get("/getConnectionRequests", userAuth, getConnectionRequests);

// api route to accept or reject the connection request
router.patch(
  "/acceptOrReject/:status/:connectionId",
  userAuth,
  acceptOrRejectConnectionRequests
);


module.exports = router;

