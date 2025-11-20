import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  console.log("🔌 Creating socket connection to:", BASE_URL);

  const socket = io(BASE_URL, {
    // Connection options
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 20000,

    // CORS options
    withCredentials: true,

    // Transport options - Render supports WebSocket, start with polling and upgrade
    transports: ["polling", "websocket"],
    upgrade: true,
    rememberUpgrade: true,

    // Engine.IO options
    forceNew: false,

    // Additional headers for CORS
    extraHeaders: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
    },
  });

  // Connection event listeners
  socket.on("connect", () => {
    console.log("✅ Socket connected successfully:", socket.id);
    console.log("🚀 Initial transport:", socket.io.engine.transport.name);

    // Listen for transport upgrades
    socket.io.engine.on("upgrade", () => {
      console.log("⬆️ Transport upgraded to:", socket.io.engine.transport.name);
    });

    socket.io.engine.on("upgradeError", (error) => {
      console.warn("⚠️ Transport upgrade failed:", error.message);
      console.log("📡 Continuing with polling transport");
    });
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error);
    console.error("Error details:", {
      message: error.message,
      type: error.type,
      description: error.description,
    });
  });

  socket.on("disconnect", (reason) => {
    console.log("🔌 Socket disconnected:", reason);
  });

  socket.io.on("error", (error) => {
    console.error("❌ Socket.IO error:", error);
  });

  return socket;
};
