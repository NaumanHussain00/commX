const { Chat } = require("../models/chat.model");

const getChat = async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user?._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({ path: "message.senderId", select: "firstName lastName _id" });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        message: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getChat };
