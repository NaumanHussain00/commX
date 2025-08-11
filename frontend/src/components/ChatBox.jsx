// components/ChatBox.js
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import profileIcon from "../assets/profileIcon.png";

const ChatBox = () => {
  const selectedUser = useSelector((state) => state.selectedChat);
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const userId = user?._id;
  const targetUserId = selectedUser?._id;

  const fetchChatMessages = async () => {
    if (!(userId && targetUserId)) {
      return;
    }
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    console.log(chat.data.message);

    const chatMessages = chat?.data?.message.map((msg) => {
      const { senderId, text } = msg;
      return {
        senderId: senderId?._id,
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
      };
    });
    setMessages(chatMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!(userId && targetUserId)) {
      // Disconnect socket if no valid users
      if (socketRef.current) {
        console.log("socket Disconnect - no valid users");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Disconnect previous socket if exists
    if (socketRef.current) {
      console.log("socket Disconnect - switching chat");
      socketRef.current.disconnect();
    }

    // Create new socket connection
    const socket = createSocketConnection();
    socketRef.current = socket;

    // Add connection event listeners
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    //As soon as the page loaded, the socket connection is made and joinChat event is emitted
    socket.emit("joinChat", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
    });

    socket.on("joinedRoom", ({ roomId, message }) => {
      console.log("🏠 Joined room:", roomId, "-", message);
    });

    socket.on("messageReceived", ({ firstName, lastName, text, senderId }) => {
      console.log("📨 Message received:", firstName + " " + lastName + " : " + text);
      setMessages((messages) => [
        ...messages,
        { firstName, lastName, text, senderId },
      ]);
    });

    socket.on("messageError", ({ error }) => {
      console.error("❌ Message error:", error);
    });

    return () => {
      console.log("socket Disconnect - cleanup");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!socketRef.current) {
      console.error("❌ No socket connection available");
      return;
    }

    if (!newMessage?.trim()) {
      console.warn("⚠️ Cannot send empty message");
      return;
    }

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 p-4 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg text-white flex flex-col">
        <div className="flex-1 flex justify-center items-center text-white text-3xl">
          Select a chat to start messaging 💬
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 bg-black/50 backdrop-blur-md rounded-2xl shadow-lg text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-cyan-600 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <img
            src={selectedUser.profileImageURL || profileIcon}
            className="rounded-full object-cover w-13 h-13"
          />
          <div>
            <p className="font-bold text-xl">
              {selectedUser.firstName + " " + selectedUser.lastName}
            </p>
            <p className="text-xs text-gray-300">Online. Last seen 2:45pm</p>
          </div>
        </div>
        <div className="flex gap-3 text-gray-100">
          {/* <button>📞</button>
          <button>🎥</button> */}
          <button>⋮</button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-2 text-sm">
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={
                "chat " +
                (user._id === msg.senderId ? "chat-end" : "chat-start")
              }
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                  />
                </div>
              </div>
              <div className="chat-header">
                {msg.firstName + " " + msg.lastName}
                <time className="text-xs opacity-50">12:45</time>
              </div>
              <div
                className={
                  "chat-bubble font-semibold " +
                  (user._id === msg.senderId
                    ? "text-white bg-gradient-to-r from-[#3bf2ff] to-[#404647]"
                    : "chat-start") +
                  " "
                }
              >
                {msg.text}
              </div>
              <div className="chat-footer opacity-50">Delivered</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newMessage?.trim()) {
              sendMessage();
            }
          }}
          type="text"
          placeholder="Type your message here..."
          className="input input-bordered rounded-full h-11 input-sm w-full bg-white/30 text-black placeholder-black/80"
        />

        <button
          onClick={sendMessage}
          className="btn btn-sm btn-circle p-5 bg-gradient-to-r from-[#3bf2ff] to-[#404647] border-none hover:hover:scale-105  text-white text-xl"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
