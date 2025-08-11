const mongoose = require("mongoose");

const connectrionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected"],
        message: `{VALUE} of status is not vaild`,
      },
      required: true,
    },
  },
  { timestamps: true }
);


const ConnectionRequestModel = mongoose.model("ConnectionRequest",connectrionRequestSchema);

module.exports= ConnectionRequestModel;