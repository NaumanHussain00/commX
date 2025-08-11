// Dynamic API URL for both HTTP requests and Socket.IO connections
export const BASE_URL = (() => {
  const hostname = window.location.hostname;
  
  // If accessing from localhost, use localhost backend
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:3000";
  }
  
  // If accessing from any other IP, use that same IP for backend
  return `http://${hostname}:3000`;
})();
