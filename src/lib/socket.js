// socket.js
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

// Connection state
let isConnected = false;

// Event listeners for connection state
socket.on("connect", () => {
  isConnected = true;
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  isConnected = false;
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("🔴 Connection error:", error.message);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("🔄 Reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log("🔄 Reconnection attempt:", attemptNumber);
});

// Helper functions
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const isSocketConnected = () => isConnected;

// Room functions
export const joinRoom = (roomId, userData) => {
  socket.emit("join-room", roomId, userData);
};

export const leaveRoom = (roomId) => {
  socket.emit("leave-room", roomId);
};

// Video sync functions
export const emitVideoPlay = (roomId, timestamp) => {
  socket.emit("video-play", roomId, timestamp);
};

export const emitVideoPause = (roomId, timestamp) => {
  socket.emit("video-pause", roomId, timestamp);
};

export const emitVideoSeek = (roomId, timestamp) => {
  socket.emit("video-seek", roomId, timestamp);
};

export const emitVideoChange = (roomId, data) => {
  socket.emit("video-change", roomId, data);
};

export const requestSync = (roomId) => {
  socket.emit("request-sync", roomId);
};

export const emitSyncTime = (roomId, currentTime) => {
  socket.emit("sync-time", roomId, currentTime);
};

// Chat functions
export const sendMessage = (roomId, message) => {
  socket.emit("send-message", roomId, message);
};

// Room control functions
export const toggleLock = (roomId, isLocked) => {
  socket.emit("toggle-lock", roomId, isLocked);
};

export const updateMuteStatus = (roomId, isMuted) => {
  socket.emit("update-mute-status", roomId, isMuted);
};

export default socket;