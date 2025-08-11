const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat.model");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server, allowedOrigins = []) => {
  // Use provided allowedOrigins or fallback to default
  const socketAllowedOrigins = allowedOrigins.length > 0 ? allowedOrigins : [
    "http://localhost:5173",
    "http://10.1.0.222:5173",
  ];

  const io = socket(server, {
    cors: {
      origin: function (origin, callback) {
        console.log('🌐 Socket connection from origin:', origin);
        
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);
        
        // Check if the origin is in our allowed list
        if (socketAllowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        
        // For development, allow any localhost or local network
        if (process.env.NODE_ENV === 'development') {
          if (origin.includes('localhost') || 
              origin.includes('127.0.0.1') || 
              origin.match(/http:\/\/10\.\d+\.\d+\.\d+/) ||
              origin.match(/http:\/\/192\.168\.\d+\.\d+/)) {
            return callback(null, true);
          }
        }
        
        console.warn('❌ CORS blocked origin:', origin);
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ["GET", "POST"],
    },
    // Transport configuration
    transports: ['polling', 'websocket'],
    allowEIO3: true, // Allow Engine.IO v3 clients
    // Polling configuration
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log("✅ New socket connection:", socket.id);
    console.log("🌐 Origin:", socket.handshake.headers.origin);
    console.log("🚀 Transport:", socket.conn.transport.name);
    
    // Log transport upgrades
    socket.conn.on('upgrade', () => {
      console.log('⬆️ Transport upgraded to:', socket.conn.transport.name);
    });
    
    socket.on("joinChat", ({ firstName, lastName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log(`👤 ${firstName} ${lastName} (${userId}) joined room: ${roomId}`);
      socket.join(roomId);
      
      // Confirm join to client
      socket.emit("joinedRoom", { roomId, message: "Successfully joined chat room" });
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(`💬 ${firstName} ${lastName}: ${text}`);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              message: [],
            });
          }

          chat.message.push({
            senderId: userId,
            text,
          });

          await chat.save();

          console.log(`📤 Broadcasting message to room: ${roomId}`);
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            senderId: userId,
          });
        } catch (err) {
          console.error("❌ Error sending message:", err);
          socket.emit("messageError", { error: "Failed to send message" });
        }
      }
    );

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", socket.id, "Reason:", reason);
    });
  });
};

module.exports = initializeSocket;
