const User = require("../models/user.model.js");
const { validateMyProfileEditData } = require("../utils/validation.js");

const profileView = (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

const profileEdit = async (req, res) => {
  try {
    if (!validateMyProfileEditData(req)) {
      throw new Error("Invalid Edit Request!");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};
module.exports = { profileView, profileEdit };