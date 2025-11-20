// Dynamic API URL for both HTTP requests and Socket.IO connections
export const BASE_URL = (() => {
  // Check if environment variable is set (useful for build-time configuration)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Otherwise, detect based on hostname
  const hostname = window.location.hostname;

  // If accessing from localhost, use localhost backend
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:3000";
  }

  // If accessing from Vercel or production domain, use deployed backend
  // This covers cases like: yourapp.vercel.app, custom domains, etc.
  if (
    hostname !== "localhost" &&
    hostname !== "127.0.0.1" &&
    !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)
  ) {
    return "https://comm-x.vercel.app";
  }

  // If accessing from any other IP address (LAN), use that same IP for backend
  return `http://${hostname}:3000`;
})();
