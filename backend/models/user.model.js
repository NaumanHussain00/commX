const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      require: true,
    },

    firstName: {
      type: String,
      require: true,
    },

    lastName: {
      type: String,
    },

    emailId: {
      type: String,
      require: true,
      unique: true,
    },

    password: {
      type: String,
      require: true,
    },

    department: {
      type: String,
      default: "general",
    },

    designation: {
      type: String,
    },

    gender: {
      require: true,
      type: String,
      enum: ["male", "female"],
    },

    profileImageURL: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
    },
  },
  { timestamp: true }
);




userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "commX@7", {
    expiresIn: "7d",
  });

  return token;
};


userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
