const ConnectionRequestModel = require("../models/connectionRequest.model.js");
const User = require("../models/user.model.js");

// api controller to send connection request

const connectionRequest = async (req, res) => {
  try {
    console.log('📤 Connection request received');
    console.log('👤 From user:', req.user?.firstName, req.user?.lastName, '(ID:', req.user?._id, ')');
    console.log('📋 Request params:', req.params);
    
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    console.log('🔄 Processing request:', { fromUserId, toUserId, status });

    const allowedStatus = ["pending"];
    if (!allowedStatus.includes(status)) {
      console.log('❌ Invalid status:', status);
      return res
        .status(400)
        .json({ message: "Invalid status type: " + status });
    }

    console.log('🔍 Looking for target user:', toUserId);
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      console.log('❌ Target user not found:', toUserId);
      return res.status(404).json({ message: "User not found!" });
    }
    console.log('✅ Target user found:', toUser.firstName, toUser.lastName);

    console.log('🔍 Checking for existing connection request...');
    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    
    if (existingConnectionRequest) {
      console.log('❌ Connection request already exists:', existingConnectionRequest);
      return res
        .status(400)
        .json({ message: "Connection Request Already Exists!!" });
    }
    console.log('✅ No existing connection request found');

    console.log('💾 Creating new connection request...');
    const newConnectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await newConnectionRequest.save();
    console.log('✅ Connection request saved:', data);

    const responseMessage = req.user.firstName + " is sending a connection request status: " + status + " to " + toUser.firstName;
    console.log('📤 Sending response:', responseMessage);

    res.json({
      message: responseMessage,
      data,
    });
  } catch (err) {
    console.error('❌ Connection request error:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(400).json({ message: "ERROR : " + err.message });
  }
};


// api controller to accept or reject the connection request

const acceptOrRejectConnectionRequests = async (req, res) => {
  const userId = req.user._id;
  // const user = User.findById(userId);
  // if (!user) {
  //   return res.send("Invalid User");
  // }

  // console.log(userId)

  const connectionRequestId = req.params.connectionId;

  const connectionRequest = await ConnectionRequestModel.find({
    _id: connectionRequestId,
    toUserId: userId,
  });

  // console.log(connectionRequest);
  // console.log(userId);

  if (connectionRequest.length == 0) {
    return res.send("Invalid Connection ID");
  }

  // if (!connectionRequest.toUserId.equals(userId)) {
  //   return res.send(" you cannot update this request ");
  // }

  const updatedStatus = req.params.status;

  const updatedConnection = await ConnectionRequestModel.findByIdAndUpdate(
    connectionRequestId,
    { status: updatedStatus }
  );

  await updatedConnection.save();

  return res.send(`Updated connection status : ${updatedStatus}`);
};





module.exports = {
  connectionRequest,
  acceptOrRejectConnectionRequests,
};
