const ConnectionRequestModel = require("../models/connectionRequest.model");
const User = require("../models/user.model");

const userAllowedData = [
  "firstName",
  "lastName",
  "username",
  "profileImageURL",
  "department",
  "gender",
];

const getConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", userAllowedData)
      .populate("toUserId", userAllowedData);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getConnectionRequests = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "pending",
    }).populate("fromUserId", userAllowedData);

    res.json({ message: "Data Fetched Successfully", data: connectionRequest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log('🔍 getAllUsers called by user:', req.user?.firstName, req.user?.lastName);
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    console.log('📄 Pagination - Page:', page, 'Limit:', limit, 'Skip:', skip);

    // Step 1: Get all users who have a connection request with the logged-in user
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    console.log('🔗 Connection requests found:', connectionRequests.length);

    // Step 2: Build a set of all user IDs involved in a connection with the user
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Step 3: Add the current user to the set as well
    hideUsersFromFeed.add(loggedInUser._id.toString());

    console.log('🚫 Users to hide from feed:', Array.from(hideUsersFromFeed));

    // First, let's check total users in database
    const totalUsers = await User.countDocuments();
    console.log('👥 Total users in database:', totalUsers);

    // Step 4: Query users not in this set
    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(userAllowedData)
      .skip(skip)
      .limit(limit);

    console.log('✅ Users found for feed:', users.length);
    console.log('📊 Users data:', users.map(u => ({ id: u._id, name: u.firstName + ' ' + u.lastName })));

    res.status(200).json({ data: users });
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    console.error("❌ Full error:", err);
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getConnections, getConnectionRequests, getAllUsers };
