const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const userAuth = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware called for:', req.method, req.path);
    console.log('🍪 Cookies received:', Object.keys(req.cookies));
    
    const { token } = req.cookies;
    if (!token) {
      console.log('❌ No token found in cookies');
      return res.status(401).json({ message: "Please Login!" });
    }

    console.log('🔑 Token found, verifying...');
    const decodedData = await jwt.verify(token, "commX@7");
    console.log('✅ Token verified for user ID:', decodedData._id);

    const { _id } = decodedData;

    const user = await User.findById(_id);

    if (!user) {
      console.log('❌ User not found in database:', _id);
      throw new Error("User does not exist!");
    }

    console.log('✅ User authenticated:', user.firstName, user.lastName);
    req.user = user;

    next();
  } catch (err) {
    console.error('❌ Auth middleware error:', err.message);
    res.status(400).json({ message: "ERROR: " + err.message });
  }
};

module.exports = userAuth;
