// components/watchMode.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import {
  FiCopy,
  FiLogOut,
  FiLock,
  FiUnlock,
  FiPlus,
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVideo,
  FiVideoOff,
  FiMic,
  FiMicOff,
  FiMonitor,
  FiSettings,
  FiSearch,
  FiX,
  FiShare2,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { HiChat, HiUserGroup, HiVideoCamera } from "react-icons/hi";
import InviteModal from "./InviteModal";
import Image from "next/image";
import favicon from "../favicon.ico";
import Settings from "./Settings";
import {
  socket,
  connectSocket,
  disconnectSocket,
  joinRoom,
  leaveRoom,
} from "../../lib/socket";

// Toast Notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center px-4 py-3 rounded-md shadow-lg transition-all transform animate-slide-in ${
        type === "success"
          ? "bg-green-500/90 text-white"
          : type === "error"
          ? "bg-red-500/90 text-white"
          : "bg-blue-500/90 text-white"
      }`}
    >
      <div className="mr-3">
        {type === "success" ? (
          <FiCheckCircle className="w-5 h-5" />
        ) : type === "error" ? (
          <FiAlertCircle className="w-5 h-5" />
        ) : (
          <FiAlertCircle className="w-5 h-5" />
        )}
      </div>
      <div>{message}</div>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

// Confirmation Dialog component
const ConfirmationDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      ></div>
      <div className="bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative z-10 border border-slate-700/50">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default function WatchMode({
  roomId = "ABC123",
  initialIsHost = false,
}) {
  // State management
  const [activeTab, setActiveTab] = useState("chat");
  const [videoUrl, setVideoUrl] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [inputUrl, setInputUrl] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [showPlatformSelection, setShowPlatformSelection] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [syncInterval, setSyncInterval] = useState(null);
  const [isHost, setIsHost] = useState(() => {
    if (typeof window === "undefined") return initialIsHost;

    // Host if URL has host=true param OR doesn't contain "join" in the path
    return (
      window.location.search.includes("host=true") ||
      !window.location.pathname.includes("/join/")
    );
  });
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempUsername, setTempUsername] = useState("");

  // New state variables
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const videoPlayerRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const vimeoPlayerRef = useRef(null);
  const socketIdRef = useRef(null);
  const processedMessagesRef = useRef(new Set());

  const [bgColor, setBgColor] = useState("#121212");
  const [bgOpacity, setBgOpacity] = useState(80);
  const [chatColor, setChatColor] = useState("#6C63FF");
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [customBackground, setCustomBackground] = useState(null);
  const [username, setUsername] = useState("Guest");

  const [playbackSpeed, setPlaybackSpeed] = useState("1");
  const [videoQuality, setVideoQuality] = useState("auto");
  const [autoPlay, setAutoPlay] = useState(true);
  const [rememberPosition, setRememberPosition] = useState(false);
  const [loopVideo, setLoopVideo] = useState(false);

  useEffect(() => {
    // Only runs on client after hydration
    setUsername(`Guest_${Math.floor(Math.random() * 1000)}`);
  }, []);

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  // Confirmation dialog
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);

  // YouTube search results - more dynamic mock data
  const mockSearchResults = {
    music: [
      {
        id: "dQw4w9WgXcQ",
        title: "Rick Astley - Never Gonna Give You Up",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
        views: "1.2B views",
        channel: "Rick Astley",
      },
      {
        id: "2Vv-BfVoq4g",
        title: "Ed Sheeran - Perfect",
        thumbnail: "https://i.ytimg.com/vi/2Vv-BfVoq4g/mqdefault.jpg",
        views: "3.1B views",
        channel: "Ed Sheeran",
      },
      {
        id: "JGwWNGJdvx8",
        title: "Ed Sheeran - Shape of You",
        thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg",
        views: "5.8B views",
        channel: "Ed Sheeran",
      },
      {
        id: "kJQP7kiw5Fk",
        title: "Luis Fonsi - Despacito ft. Daddy Yankee",
        thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
        views: "8.1B views",
        channel: "Luis Fonsi",
      },
    ],
    gaming: [
      {
        id: "qHmfMxGSRzY",
        title: "Minecraft 1.20 - Official Trailer",
        thumbnail: "https://i.ytimg.com/vi/qHmfMxGSRzY/mqdefault.jpg",
        views: "15M views",
        channel: "Minecraft",
      },
      {
        id: "G4z_jKXeg7A",
        title: "GTA 6 - Fan-Made Trailer",
        thumbnail: "https://i.ytimg.com/vi/G4z_jKXeg7A/mqdefault.jpg",
        views: "4.3M views",
        channel: "GTA Series",
      },
      {
        id: "rn9X6VZ_cAs",
        title: "Best Gaming Moments 2023",
        thumbnail: "https://i.ytimg.com/vi/rn9X6VZ_cAs/mqdefault.jpg",
        views: "2.8M views",
        channel: "GameSpot",
      },
    ],
    news: [
      {
        id: "bBT5HoSK5a0",
        title: "Breaking News: Latest Updates",
        thumbnail: "https://i.ytimg.com/vi/bBT5HoSK5a0/mqdefault.jpg",
        views: "1.7M views",
        channel: "CNN",
      },
      {
        id: "f8PmKpUQTHI",
        title: "Tech News Weekly Roundup",
        thumbnail: "https://i.ytimg.com/vi/f8PmKpUQTHI/mqdefault.jpg",
        views: "421K views",
        channel: "TechNews",
      },
      {
        id: "LDaC4U-zECk",
        title: "Science News Highlights",
        thumbnail: "https://i.ytimg.com/vi/LDaC4U-zECk/mqdefault.jpg",
        views: "587K views",
        channel: "ScienceToday",
      },
    ],
  };

  // Client-side only code to fix hydration issues
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set initial participant (just you) - client-side only
      setParticipants([
        { id: "local", name: username, isHost, isMuted: isMicMuted },
      ]);
    }
  }, []);

  // Initialize YouTube API
  useEffect(() => {
    // Load YouTube API
    if (typeof window !== "undefined") {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = initializeYouTubePlayer;
      } else if (videoUrl && selectedPlatform === "youtube") {
        initializeYouTubePlayer();
      }
    }

    return () => {
      // Cleanup YouTube player
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
      }
    };
  }, [videoUrl, selectedPlatform]);

  // Initialize socket connection
  useEffect(() => {
    // Client-side only
    if (typeof window === "undefined") return;

    // Always establish the connection, but don't join yet for guests
    connectSocket();

    setShowNamePrompt(true);

    // For hosts, join immediately
    if (isHost) {
      handleSocketConnect();

      // Start sync interval if host
      const interval = setInterval(sendHostSync, 10000);
      setSyncInterval(interval);
    } else {
      // For guests, just show the prompt
      setShowNamePrompt(true);
    }

    // Just keep track of socket connection
    const onConnect = () => {
      socketIdRef.current = socket.id;
      console.log("Connected with socket ID:", socket.id);
    };

    socket.on("connect", onConnect);

    // Setup socket event listeners
    setupSocketListeners();

    return () => {
      // Clean up on unmount
      if (typeof window !== "undefined") {
        leaveRoom(roomId);
        disconnectSocket();

        if (syncInterval) {
          clearInterval(syncInterval);
        }

        socket.off("connect", onConnect);
      }
    };
  }, [roomId, isHost]);

  useEffect(() => {
    // Only run this effect when a video is playing
    if (videoUrl && typeof window !== "undefined") {
      // Function to handle back button
      const handleBackButton = (e) => {
        // If video is playing, show platform selection instead of navigating away
        if (videoUrl) {
          e.preventDefault();
          setVideoUrl("");
          setShowPlatformSelection(true);
          setSearchTerm("");
          setSearchResults([]);
          // Push current URL again to avoid back button behavior
          window.history.pushState(null, "", window.location.href);
          return;
        }
      };

      // Add history state on component mount
      window.history.pushState(null, "", window.location.href);

      // Listen for back button presses
      window.addEventListener("popstate", handleBackButton);

      // Clean up event listener
      return () => {
        window.removeEventListener("popstate", handleBackButton);
      };
    }
  }, [videoUrl]);

  const applyVideoSettings = () => {
    if (!youtubePlayerRef.current || !isVideoReady) return;

    // Apply playback speed
    youtubePlayerRef.current.setPlaybackRate(parseFloat(playbackSpeed));

    // Apply video quality
    if (videoQuality !== "auto") {
      // Convert quality format (e.g., "720p" to "hd720")
      let ytQuality = "default";
      switch (videoQuality) {
        case "240p":
          ytQuality = "small";
          break;
        case "360p":
          ytQuality = "medium";
          break;
        case "480p":
          ytQuality = "large";
          break;
        case "720p":
          ytQuality = "hd720";
          break;
        case "1080p":
          ytQuality = "hd1080";
          break;
        case "4k":
          ytQuality = "highres";
          break;
      }
      youtubePlayerRef.current.setPlaybackQuality(ytQuality);
    }

    // Apply loop setting
    // YouTube API doesn't have direct loop control, so we'll implement via events
    // Loop will be handled in onYouTubePlayerStateChange
  };

  const handleJoinWithName = () => {
    // Get the name from input
    const finalName =
      tempUsername.trim() || `Guest_${Math.floor(Math.random() * 1000)}`;

    // Update state AND localStorage
    setUsername(finalName);
    if (typeof window !== "undefined") {
      localStorage.setItem("watchPartyUsername", finalName);
    }

    // Hide the prompt
    setShowNamePrompt(false);

    // Connect with this name AND host status
    if (socket.connected) {
      joinRoom(roomId, {
        name: finalName,
        isHost: isHost, // Pass current host status
        isMuted: isMicMuted,
      });
      socket.emit("request-sync", roomId);
    } else {
      socket.once("connect", () => {
        joinRoom(roomId, {
          name: finalName,
          isHost: isHost, // Pass current host status
          isMuted: isMicMuted,
        });
        socket.emit("request-sync", roomId);
      });
    }

    // Start sync interval if host
    if (isHost) {
      const interval = setInterval(sendHostSync, 10000);
      setSyncInterval(interval);
    }
  };

  const handleSocketConnect = () => {
    if (socket.connected) {
      joinRoom(roomId, {
        name: username,
        isHost: initialIsHost,
        isMuted: isMicMuted,
      });

      // Request initial sync
      socket.emit("request-sync", roomId);
    } else {
      socket.once("connect", () => {
        joinRoom(roomId, {
          name: username,
          isHost: initialIsHost,
          isMuted: isMicMuted,
        });

        // Request initial sync
        socket.emit("request-sync", roomId);
      });
    }
  };

  // Sync time with server (for host)
  const sendHostSync = () => {
    if (isHost && youtubePlayerRef.current && isVideoReady) {
      const time = youtubePlayerRef.current.getCurrentTime();
      setCurrentTime(time);

      socket.emit("host-sync", roomId, {
        currentTime: time,
        isPlaying: isPlaying,
      });
    }
  };

  // Initialize YouTube player
  const initializeYouTubePlayer = () => {
    if (
      !videoUrl ||
      selectedPlatform !== "youtube" ||
      typeof window === "undefined"
    )
      return;

    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.destroy();
    }

    youtubePlayerRef.current = new window.YT.Player("youtube-player", {
      videoId: videoUrl,
      playerVars: {
        autoplay: 1,
        controls: 1, // Hide controls, we'll use our own
        disablekb: 1,
        enablejsapi: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onReady: onYouTubePlayerReady,
        onStateChange: onYouTubePlayerStateChange,
      },
    });
  };

  // YouTube player event handlers
  const onYouTubePlayerReady = (event) => {
    setIsVideoReady(true);

    // Apply video settings
    applyVideoSettings();

    if (isHost || autoPlay) {
      event.target.playVideo();
      setIsPlaying(true);
    } else if (isPlaying) {
      event.target.playVideo();
      event.target.seekTo(currentTime, true);
    } else {
      event.target.pauseVideo();
      event.target.seekTo(currentTime, true);
    }
  };

  const onYouTubePlayerStateChange = (event) => {
    if (!isVideoReady || isSeeking) return;

    // Only respond to user actions if we're the host or room is unlocked
    if (isHost || !isLocked) {
      if (event.data === window.YT.PlayerState.PLAYING) {
        setIsPlaying(true);
        const time = youtubePlayerRef.current.getCurrentTime();
        socket.emit("video-play", roomId, time);
      } else if (event.data === window.YT.PlayerState.PAUSED) {
        setIsPlaying(false);
        const time = youtubePlayerRef.current.getCurrentTime();
        socket.emit("video-pause", roomId, time);
      } else if (event.data === window.YT.PlayerState.ENDED && loopVideo) {
        // Restart video if loop is enabled
        youtubePlayerRef.current.seekTo(0);
        youtubePlayerRef.current.playVideo();
      }
    }
  };

  // Show toast notification
  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  // Setup socket event listeners
  const setupSocketListeners = () => {
    // Room state
    socket.on("room-state", (roomState) => {
      console.log("Room state received:", roomState);

      if (roomState.videoId && roomState.videoId !== videoUrl) {
        setVideoUrl(roomState.videoId);
        setSelectedPlatform(roomState.platform);
        setShowPlatformSelection(false);
      }

      setIsPlaying(roomState.isPlaying);
      setIsLocked(roomState.isLocked);
      setCurrentTime(roomState.currentTime);
      const amIHost = socket.id === roomState.host;
      setIsHost(amIHost);

      // Sync video time
      if (youtubePlayerRef.current && isVideoReady) {
        setIsSeeking(true);
        youtubePlayerRef.current.seekTo(roomState.currentTime, true);

        if (roomState.isPlaying) {
          youtubePlayerRef.current.playVideo();
        } else {
          youtubePlayerRef.current.pauseVideo();
        }

        setTimeout(() => {
          setIsSeeking(false);
        }, 500);
      }

      // Update participants
      if (roomState.users) {
        // Ensure only the actual host has isHost=true
        const updatedParticipants = roomState.users.map((user) => ({
          ...user,
          isHost: user.id === roomState.host,
        }));
        setParticipants(updatedParticipants);
      }
    });

    // Room state updates
    socket.on("room-state-update", (stateUpdate) => {
      if (stateUpdate.users && stateUpdate.host) {
        // Ensure only the actual host has isHost=true
        const updatedParticipants = stateUpdate.users.map((user) => ({
          ...user,
          isHost: user.id === stateUpdate.host,
        }));
        setParticipants(updatedParticipants);
      } else if (stateUpdate.users) {
        setParticipants(stateUpdate.users);
      }

      if (stateUpdate.isLocked !== undefined) {
        setIsLocked(stateUpdate.isLocked);
      }

      if (stateUpdate.host) {
        setIsHost(socketIdRef.current === stateUpdate.host);
      }
    });

    // Video events
    socket.on("video-play", (timestamp) => {
      setIsPlaying(true);
      setCurrentTime(timestamp);

      if (youtubePlayerRef.current && isVideoReady && !isHost) {
        setIsSeeking(true);
        youtubePlayerRef.current.seekTo(timestamp, true);
        youtubePlayerRef.current.playVideo();

        setTimeout(() => {
          setIsSeeking(false);
        }, 500);
      }
    });

    socket.on("video-pause", (timestamp) => {
      setIsPlaying(false);
      setCurrentTime(timestamp);

      if (youtubePlayerRef.current && isVideoReady && !isHost) {
        setIsSeeking(true);
        youtubePlayerRef.current.pauseVideo();
        youtubePlayerRef.current.seekTo(timestamp, true);

        setTimeout(() => {
          setIsSeeking(false);
        }, 500);
      }
    });

    socket.on("video-seek", (timestamp) => {
      setCurrentTime(timestamp);

      if (youtubePlayerRef.current && isVideoReady && !isHost) {
        setIsSeeking(true);
        youtubePlayerRef.current.seekTo(timestamp, true);

        setTimeout(() => {
          setIsSeeking(false);
        }, 500);
      }
    });

    socket.on("video-change", (data) => {
      setVideoUrl(data.videoId);
      setSelectedPlatform(data.platform);
      setShowPlatformSelection(false);
      setCurrentTime(0);

      showToast(`Video changed to ${data.platform} content`, "info");
    });

    // Sync responses
    socket.on("sync-response", (data) => {
      if (data.videoId && data.videoId !== videoUrl) {
        setVideoUrl(data.videoId);
        setSelectedPlatform(data.platform);
        setShowPlatformSelection(false);
      }

      setIsPlaying(data.isPlaying);
      setIsLocked(data.isLocked);
      setCurrentTime(data.currentTime);

      // Apply sync if player is ready
      if (youtubePlayerRef.current && isVideoReady) {
        setIsSeeking(true);
        youtubePlayerRef.current.seekTo(data.currentTime, true);

        if (data.isPlaying) {
          youtubePlayerRef.current.playVideo();
        } else {
          youtubePlayerRef.current.pauseVideo();
        }

        setTimeout(() => {
          setIsSeeking(false);
        }, 500);
      }
    });

    socket.on("sync-time", (timestamp) => {
      if (!isHost && Math.abs(currentTime - timestamp) > 2) {
        setCurrentTime(timestamp);

        if (youtubePlayerRef.current && isVideoReady) {
          setIsSeeking(true);
          youtubePlayerRef.current.seekTo(timestamp, true);

          setTimeout(() => {
            setIsSeeking(false);
          }, 500);
        }
      }
    });

    socket.on("host-sync", (syncData) => {
      if (!isHost) {
        setCurrentTime(syncData.currentTime);
        setIsPlaying(syncData.isPlaying);

        if (
          youtubePlayerRef.current &&
          isVideoReady &&
          Math.abs(
            youtubePlayerRef.current.getCurrentTime() - syncData.currentTime
          ) > 2
        ) {
          setIsSeeking(true);
          youtubePlayerRef.current.seekTo(syncData.currentTime, true);

          if (
            syncData.isPlaying &&
            youtubePlayerRef.current.getPlayerState() !==
              window.YT.PlayerState.PLAYING
          ) {
            youtubePlayerRef.current.playVideo();
          } else if (
            !syncData.isPlaying &&
            youtubePlayerRef.current.getPlayerState() ===
              window.YT.PlayerState.PLAYING
          ) {
            youtubePlayerRef.current.pauseVideo();
          }

          setTimeout(() => {
            setIsSeeking(false);
          }, 500);
        }
      }
    });

    // Chat messages
    socket.on("receive-message", (message) => {
      // Check if we've already processed this message
      if (!processedMessagesRef.current.has(message.id)) {
        processedMessagesRef.current.add(message.id);

        // Format the message for display
        const formattedMessage = {
          id: message.id,
          user: message.userName || message.user,
          text: message.text,
          time: message.timestamp
            ? new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
          isSystem: message.isSystem,
        };

        setMessages((prev) => [...prev, formattedMessage]);
      }
    });

    // Room status
    socket.on("room-locked", (isLocked) => {
      setIsLocked(isLocked);
      showToast(`Room is now ${isLocked ? "locked" : "unlocked"}`, "info");
    });

    // Participants
    socket.on("user-joined", (user) => {
      console.log("User joined:", user);

      // Update participants list
      setParticipants((prev) => {
        // Check if already in list
        const exists = prev.some((p) => p.id === user.id);
        if (!exists) {
          return [...prev, user];
        }
        return prev;
      });

      // Show notification
      showToast(`${user.name} joined the room`, "success");
    });

    socket.on("user-left", (userData) => {
      console.log("User left:", userData);

      // Update participants list
      setParticipants((prev) => {
        return prev.filter((p) => p.id !== userData.id);
      });

      // Show notification
      showToast(`${userData.name} left the room`, "info");
    });

    socket.on("user-updated", (userData) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === userData.id ? { ...p, ...userData } : p))
      );
    });

    socket.on("host-assigned", (data) => {
      // We've been promoted to host
      setIsHost(true);

      // Show notification
      showToast(data.message || "You are now the host of this room", "success");

      // Add system message
      const hostMessage = {
        id: `system-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
        user: "System",
        text: data.message || "You are now the host of this room",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isSystem: true,
      };

      setMessages((prev) => [...prev, hostMessage]);

      // Start host sync interval
      if (!syncInterval) {
        const interval = setInterval(sendHostSync, 10000);
        setSyncInterval(interval);
      }
    });
  };

  // Handle leave room with confirmation
  const handleLeaveRoom = () => {
    setShowLeaveConfirmation(true);
  };

  const confirmLeaveRoom = () => {
    socket.emit("leave-room", roomId);
    // Redirect to homepage or other page
    window.location.href = "/";
  };

  // Handle playback controls
  const handlePlayPause = () => {
    if (!youtubePlayerRef.current || !isVideoReady) return;

    if (isPlaying) {
      youtubePlayerRef.current.pauseVideo();
      // Server event emitted in onYouTubePlayerStateChange
    } else {
      youtubePlayerRef.current.playVideo();
      // Server event emitted in onYouTubePlayerStateChange
    }
  };

  const handleSeekBackward = () => {
    if (!youtubePlayerRef.current || !isVideoReady) return;

    if (isHost || !isLocked) {
      const newTime = Math.max(
        youtubePlayerRef.current.getCurrentTime() - 10,
        0
      );
      youtubePlayerRef.current.seekTo(newTime, true);
      socket.emit("video-seek", roomId, newTime);
    } else {
      showToast("Only the host can seek when the room is locked", "error");
    }
  };

  const handleSeekForward = () => {
    if (!youtubePlayerRef.current || !isVideoReady) return;

    if (isHost || !isLocked) {
      const newTime = youtubePlayerRef.current.getCurrentTime() + 10;
      youtubePlayerRef.current.seekTo(newTime, true);
      socket.emit("video-seek", roomId, newTime);
    } else {
      showToast("Only the host can seek when the room is locked", "error");
    }
  };

  const handleAddVideo = () => {
    if (inputUrl.trim() || searchTerm.trim()) {
      let videoId = inputUrl.trim() || searchTerm.trim();

      if (selectedPlatform === "youtube") {
        // Extract from regular youtube.com URL
        if (videoId.includes("youtube.com/watch?v=")) {
          try {
            const urlParams = new URLSearchParams(new URL(videoId).search);
            videoId = urlParams.get("v");
          } catch (error) {
            console.error("Invalid URL format:", error);
          }
        }
        // Extract from youtu.be short URL
        else if (videoId.includes("youtu.be/")) {
          videoId = videoId.split("youtu.be/")[1]?.split("?")[0] || videoId;
        }
        // Extract from youtube.com/embed URL
        else if (videoId.includes("youtube.com/embed/")) {
          videoId =
            videoId.split("youtube.com/embed/")[1]?.split("?")[0] || videoId;
        }
      }

      // Check if user can change video
      if (isHost || !isLocked) {
        setVideoUrl(videoId);
        setInputUrl("");
        setSearchTerm("");
        setIsPlaying(true);

        // Emit video change to server
        socket.emit("video-change", roomId, {
          videoId: videoId,
          platform: selectedPlatform,
        });

        // Show notification
        showToast("Video changed successfully", "success");
      } else {
        // Show notification if room is locked
        showToast("Cannot change video - room is locked by host", "error");
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const msgId = `${socket.id}-${Date.now()}`;

      const newMsg = {
        id: msgId,
        user: username,
        text: newMessage,
      };

      // Add to processed set to prevent duplication
      processedMessagesRef.current.add(msgId);

      // Clear input
      setNewMessage("");

      // Send message via socket
      socket.emit("send-message", roomId, newMsg);
    }
  };

  const handleSearch = () => {
    console.log("Search triggered with:", searchTerm);

    if (
      searchTerm.trim().includes("youtube.com") ||
      searchTerm.trim().includes("youtu.be")
    ) {
      // Handle as URL
      handleAddVideo();
    } else if (searchTerm.trim()) {
      // Generate somewhat dynamic search results based on search term
      let results = [];

      // Check if search term matches any of our categories
      const term = searchTerm.toLowerCase();
      if (term.includes("music")) {
        results = mockSearchResults.music;
      } else if (term.includes("game") || term.includes("gaming")) {
        results = mockSearchResults.gaming;
      } else if (term.includes("news")) {
        results = mockSearchResults.news;
      } else {
        // Default to a mix of results
        results = [
          mockSearchResults.music[0],
          mockSearchResults.gaming[0],
          mockSearchResults.news[0],
          mockSearchResults.music[1],
          mockSearchResults.gaming[1],
        ];
      }

      console.log("Search results:", results);
      setSearchResults(results);
    }
  };

  const playVideo = (videoId) => {
    if (isHost || !isLocked) {
      setVideoUrl(videoId);
      setIsPlaying(true);
      setIsSearching(false);
      setSearchTerm("");

      // Emit video change to server
      socket.emit("video-change", roomId, {
        videoId: videoId,
        platform: selectedPlatform,
      });

      // Show notification
      showToast("Video changed successfully", "success");
    } else {
      // Show notification if room is locked
      showToast("Cannot change video - room is locked by host", "error");
    }
  };

  const handleToggleLock = () => {
    if (!isHost) return;

    const newLockedState = !isLocked;
    setIsLocked(newLockedState);

    // Emit to server
    socket.emit("toggle-lock", roomId, newLockedState);
  };

  const handleToggleMicrophone = () => {
    const newMuteState = !isMicMuted;
    setIsMicMuted(newMuteState);

    // Update on server
    socket.emit("update-mute-status", roomId, newMuteState);
  };

  // CSS for animation
  const animationStyles = `
    @keyframes slide-in {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `;

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      {/* Add animation styles */}
      <style>{animationStyles}</style>

      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Leave confirmation dialog */}
      <ConfirmationDialog
        isOpen={showLeaveConfirmation}
        onConfirm={confirmLeaveRoom}
        onCancel={() => setShowLeaveConfirmation(false)}
        title="Leave Room"
        message="Are you sure you want to leave this room? You will need a new invite link to rejoin."
      />

      {/* Name Prompt Modal */}
      {showNamePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative z-10 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-4">
              Enter Your Name
            </h3>
            <p className="text-gray-300 mb-6">
              Choose a name that others will see in this watch party
            </p>

            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              placeholder="Your name"
              className="w-full bg-slate-700/50 border border-slate-600/50 focus:border-purple-500/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-0 transition-all mb-4"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleJoinWithName();
                }
              }}
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleJoinWithName()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-md transition-colors"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background effects */}
      <div className="fixed inset-0 z-0" style={{ opacity: bgOpacity / 100 }}>
        {selectedBackground || customBackground ? (
          <img
            src={
              selectedBackground
                ? `/bg${selectedBackground}.jpg`
                : customBackground
            }
            alt="Background"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ backgroundColor: bgColor }}
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full"
            style={{ backgroundColor: bgColor }}
          ></div>
        )}
      </div>
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      {/* Main content */}
      <div className="relative flex flex-col h-full z-10">
        {/* TOP BAR */}
        <div className="h-14 bg-slate-900/60 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="relative mr-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={favicon}
                      alt="TogetherTime Logo"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 blur opacity-40 animate-pulse pointer-events-none"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                TogetherTime
              </span>
            </div>
          </div>

          {/* Media Controls */}
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isCameraMuted
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-slate-800/80 text-gray-300 border border-slate-700/70 hover:bg-slate-700/80 hover:border-slate-600/80"
              }`}
              onClick={() => setIsCameraMuted(!isCameraMuted)}
            >
              {isCameraMuted ? <FiVideoOff /> : <FiVideo />}
            </button>

            <button
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isMicMuted
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-slate-800/80 text-gray-300 border border-slate-700/70 hover:bg-slate-700/80 hover:border-slate-600/80"
              }`}
              onClick={handleToggleMicrophone}
            >
              {isMicMuted ? <FiMicOff /> : <FiMic />}
            </button>

            <button
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isScreenSharing
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-slate-800/80 text-gray-300 border border-slate-700/70 hover:bg-slate-700/80 hover:border-slate-600/80"
              }`}
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
              <FiMonitor />
            </button>

            <div className="h-6 w-px bg-slate-700/70 mx-1"></div>

            <div className="bg-slate-800/80 rounded-md px-3 py-1.5 text-sm flex items-center border border-slate-700/70">
              <span className="text-gray-400 mr-2">Room:</span>
              <span className="font-medium text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                {roomId}
              </span>
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-500 hover:to-pink-500 text-white px-3 py-1.5 rounded-md text-sm flex items-center space-x-2 transition-all shadow-md shadow-purple-500/10 cursor-pointer"
            >
              <FiShare2 className="text-white" />
              <span>Invite</span>
            </button>

            <button
              className="p-2 rounded-full bg-slate-800/80 text-gray-300 border border-slate-700/70 hover:bg-slate-700/80 hover:border-slate-600/80 transition-all cursor-pointer"
              onClick={() => setShowSettings(true)}
            >
              <FiSettings />
            </button>

            <button
              className="bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 rounded-md px-3 py-1.5 text-sm flex items-center space-x-2 border border-red-500/30 transition-all cursor-pointer"
              onClick={handleLeaveRoom}
            >
              <FiLogOut />
              <span>Leave</span>
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex flex-1 overflow-hidden">
          {/* VIDEO + CONTROLS SECTION */}
          <div className="flex-1 flex flex-col">
            {/* VIDEO AREA */}
            <div className="bg-slate-900/40 backdrop-blur-sm flex-1 flex items-center justify-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLW9wYWNpdHk9Ii4xIj48cGF0aCBkPSJNMTggMzBoMjRNNiAxOHYyNG0xMiAwdjI0TTMwIDB2MjRtMTIgNnYyNG0xMi0yNHYyNE0wIDMwaDI0TTMwIDMwaDI0TTMwIDEydjE4Ii8+PC9nPjwvc3ZnPg==')] bg-repeat opacity-20"></div>
              </div>

              {videoUrl ? (
                <div className="w-full h-full relative">
                  {/* Video gradient frame */}
                  <div className="absolute inset-0 p-0.5 z-10 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 z-10 pointer-events-none"></div>
                  </div>

                  {selectedPlatform === "youtube" && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div id="youtube-player" className="w-full h-full"></div>
                    </div>
                  )}

                  {selectedPlatform === "vimeo" && (
                    <div className="w-full h-full flex items-center justify-center">
                      <iframe
                        ref={videoPlayerRef}
                        src={`https://player.vimeo.com/video/${videoUrl}?autoplay=1`}
                        title="Vimeo video player"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  )}
                </div>
              ) : showPlatformSelection ? (
                // Platform selection screen
                <div className="text-center p-8 max-w-4xl mx-auto relative z-20 animate-fade-in">
                  <div className="mb-8 relative">
                    <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text mb-2">
                      Choose a Platform
                    </h3>
                    <p className="text-gray-400 max-w-lg mx-auto">
                      Select a content source to watch together with perfect
                      synchronization
                    </p>
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-8 bg-purple-500/20 blur-3xl"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 md:grid-cols-4 gap-y-6">
                    {/* YouTube */}
                    <div
                      className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm hover:from-red-900/10 hover:to-red-900/5 border border-slate-700/50 hover:border-red-500/30 rounded-xl p-5 transition-all duration-300 cursor-pointer overflow-hidden shadow-md"
                      onClick={() => {
                        setSelectedPlatform("youtube");
                        setShowPlatformSelection(false);
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      <div className="w-12 h-12 mx-auto mb-3 bg-red-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-red-500/10">
                        <svg
                          className="w-6 h-6 text-red-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-red-300 transition-colors">
                        YouTube
                      </h4>
                      <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                        Watch videos together
                      </p>
                    </div>

                    {/* Vimeo */}
                    <div
                      className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm hover:from-blue-900/10 hover:to-blue-900/5 border border-slate-700/50 hover:border-blue-500/30 rounded-xl p-5 transition-all duration-300 cursor-pointer overflow-hidden shadow-md"
                      onClick={() => {
                        setSelectedPlatform("vimeo");
                        setShowPlatformSelection(false);
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10">
                        <svg
                          className="w-6 h-6 text-blue-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                        Vimeo
                      </h4>
                      <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                        Premium content
                      </p>
                    </div>

                    {/* File Upload */}
                    <div
                      className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm hover:from-green-900/10 hover:to-green-900/5 border border-slate-700/50 hover:border-green-500/30 rounded-xl p-5 transition-all duration-300 cursor-pointer overflow-hidden shadow-md"
                      onClick={() => {
                        setSelectedPlatform("file");
                        setShowPlatformSelection(false);
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      <div className="w-12 h-12 mx-auto mb-3 bg-green-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-green-500/10">
                        <svg
                          className="w-6 h-6 text-green-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="12" y1="18" x2="12" y2="12"></line>
                          <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-green-300 transition-colors">
                        Local File
                      </h4>
                      <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                        Upload video files
                      </p>
                    </div>

                    {/* Direct URL */}
                    <div
                      className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm hover:from-purple-900/10 hover:to-purple-900/5 border border-slate-700/50 hover:border-purple-500/30 rounded-xl p-5 transition-all duration-300 cursor-pointer overflow-hidden shadow-md"
                      onClick={() => {
                        setSelectedPlatform("url");
                        setShowPlatformSelection(false);
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/10">
                        <svg
                          className="w-6 h-6 text-purple-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                        Direct URL
                      </h4>
                      <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                        Any video link
                      </p>
                    </div>

                    {/* Netflix - Coming Soon */}
                    <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 opacity-80 shadow-md overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px] rounded-xl">
                        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-3 py-1 rounded-full text-xs font-medium shadow-inner">
                          Coming Soon
                        </div>
                      </div>
                      <div className="w-12 h-12 mx-auto mb-3 bg-red-700/10 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-red-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-1.2-.624-3.85-.393-3.85-.393V0z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        Netflix
                      </h4>
                      <p className="text-gray-400 text-xs">Shows and movies</p>
                    </div>

                    {/* Disney+ - Coming Soon */}
                    <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 opacity-80 shadow-md overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px] rounded-xl">
                        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-3 py-1 rounded-full text-xs font-medium shadow-inner">
                          Coming Soon
                        </div>
                      </div>
                      <div className="w-12 h-12 mx-auto mb-3 bg-blue-600/10 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M5.75 1C5.55 1 5.351 1.05 5.17 1.1 1.33 2.3 0 6.07 0 12c0 5.93 1.33 9.7 5.17 10.9.181.05.38.1.58.1h12.5c.2 0 .399-.05.58-.1C22.67 21.7 24 17.93 24 12c0-5.93-1.33-9.7-5.17-10.9C18.649 1.05 18.45 1 18.25 1H5.75z" />
                          <path
                            d="M5.8 5.714c0-.316.256-.572.572-.572h11.256c.316 0 .572.256.572.572V18.286c0 .316-.256.572-.572.572H6.372a.572.572 0 01-.572-.572V5.714z"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        Disney+
                      </h4>
                      <p className="text-gray-400 text-xs">Disney content</p>
                    </div>

                    {/* Twitch - Coming Soon */}
                    <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 opacity-80 shadow-md overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px] rounded-xl">
                        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-3 py-1 rounded-full text-xs font-medium shadow-inner">
                          Coming Soon
                        </div>
                      </div>
                      <div className="w-12 h-12 mx-auto mb-3 bg-purple-700/10 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-purple-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M2.149 0L0.754 4.156V20.594H6.297V24H10.102L13.508 20.594H18.289L23.832 15.051V0H2.149ZM21.676 13.976L17.973 17.68H12.043L8.637 21.086V17.68H4.043V2.156H21.676V13.976Z" />
                          <path d="M18.289 6.352H16.133V12.781H18.289V6.352Z" />
                          <path d="M13.195 6.352H11.039V12.781H13.195V6.352Z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        Twitch
                      </h4>
                      <p className="text-gray-400 text-xs">Live streams</p>
                    </div>

                    {/* Amazon Prime Video - Coming Soon */}
                    <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 opacity-80 shadow-md overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px] rounded-xl">
                        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-3 py-1 rounded-full text-xs font-medium shadow-inner">
                          Coming Soon
                        </div>
                      </div>
                      <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12.112 7.261L15.047 13.035L17.957 7.261H20.997L16.047 16.739L12.112 7.261ZM13.112 3H20.775C21.435 3 22.112 3.636 22.112 4.5V19.5C22.112 20.364 21.435 21 20.775 21H3.449C2.789 21 2.112 20.364 2.112 19.5V4.5C2.112 3.636 2.789 3 3.449 3H13.112Z" />
                          <path d="M4.112 13.5H10.112V15H4.112V13.5Z" />
                          <path d="M4.112 9H8.112V10.5H4.112V9Z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        Prime Video
                      </h4>
                      <p className="text-gray-400 text-xs">Amazon originals</p>
                    </div>
                  </div>
                </div>
              ) : (
                // URL input for the selected platform
                <div className="text-center p-8 max-w-3xl mx-auto animate-fade-in">
                  <div className="w-16 h-16 relative mx-auto mb-6">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center">
                      {selectedPlatform === "youtube" && (
                        <svg
                          className="w-6 h-6 text-red-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      )}
                      {selectedPlatform === "vimeo" && (
                        <svg
                          className="w-6 h-6 text-blue-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z" />
                        </svg>
                      )}
                      {selectedPlatform === "file" && (
                        <svg
                          className="w-6 h-6 text-green-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="12" y1="18" x2="12" y2="12"></line>
                          <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                      )}
                      {selectedPlatform === "url" && (
                        <svg
                          className="w-6 h-6 text-purple-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                      )}
                      {!selectedPlatform && (
                        <FiPlay className="text-purple-400 w-6 h-6" />
                      )}
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-sm animate-pulse"></div>
                  </div>

                  <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text mb-3">
                    {selectedPlatform === "youtube"
                      ? "Enter YouTube Link or Search"
                      : selectedPlatform === "vimeo"
                      ? "Enter Vimeo Link"
                      : selectedPlatform === "file"
                      ? "Upload Video File"
                      : selectedPlatform === "url"
                      ? "Enter Video URL"
                      : "Enter Video Link"}
                  </h3>

                  <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                    {selectedPlatform === "youtube"
                      ? "Search for videos or paste a YouTube link to watch together with perfect sync"
                      : selectedPlatform === "vimeo"
                      ? "Paste a Vimeo link to watch together with perfect sync"
                      : selectedPlatform === "file"
                      ? "Upload a video file from your computer to watch together"
                      : "Paste a video link to start watching together with everyone in the room"}
                  </p>

                  {selectedPlatform === "file" ? (
                    <div className="flex justify-center mb-5">
                      <div className="relative max-w-md w-full">
                        <label className="group flex flex-col items-center justify-center w-full h-48 bg-slate-800/60 border-2 border-dashed border-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-700/40 hover:border-green-500/30 transition-all duration-300">
                          <div className="flex flex-col items-center justify-center p-5">
                            <div className="w-16 h-16 mb-3 rounded-full bg-slate-900/60 flex items-center justify-center group-hover:bg-green-500/10 transition-colors">
                              <svg
                                className="w-8 h-8 text-gray-400 group-hover:text-green-400 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                              </svg>
                            </div>
                            <p className="mb-2 text-sm text-gray-300 group-hover:text-white transition-colors">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              MP4, WebM or other video files (MAX. 1GB)
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="video/*"
                          />
                        </label>
                      </div>
                    </div>
                  ) : selectedPlatform === "youtube" ? (
                    <div className="flex flex-col w-full max-w-2xl mx-auto">
                      <div className="flex items-stretch mb-5">
                        <div className="relative flex-grow group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-l-lg opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                          </div>
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setIsSearching(e.target.value.trim() !== "");
                            }}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && searchTerm.trim()) {
                                handleSearch();
                              }
                            }}
                            placeholder="Search on YouTube or paste a link..."
                            className="w-full bg-slate-800/60 border border-slate-700/50 group-focus-within:border-purple-500/50 rounded-l-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-0 transition-all"
                          />
                          {searchTerm && (
                            <button
                              onClick={() => {
                                setSearchTerm("");
                                setIsSearching(false);
                                setSearchResults([]);
                              }}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white"
                            >
                              <FiX className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={handleSearch}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 rounded-r-xl text-sm font-medium transition-all shadow-md shadow-purple-500/10 flex items-center justify-center"
                        >
                          <FiSearch className="h-5 w-5" />
                        </button>
                      </div>

                      {isSearching && searchResults.length > 0 && (
                        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden mb-6 animate-fade-in shadow-lg">
                          <div className="p-3 bg-slate-900/60 text-sm text-gray-300 font-medium border-b border-slate-700/70 flex items-center justify-between">
                            <div className="flex items-center">
                              <FiSearch className="h-4 w-4 mr-2 text-purple-400" />
                              <span>Search results</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-400">
                              <FiClock className="h-3 w-3 mr-1" />
                              <span>Updated just now</span>
                            </div>
                          </div>
                          <div className="max-h-[320px] overflow-y-auto">
                            {searchResults.map((result) => (
                              <div
                                key={result.id}
                                onClick={() => playVideo(result.id)}
                                className="flex p-3 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700/50 last:border-none transition-colors group"
                              >
                                <div className="relative w-24 h-16 flex-shrink-0">
                                  <img
                                    src={result.thumbnail}
                                    alt={result.title}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center rounded-lg">
                                    <FiPlay className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-0 group-hover:scale-100 transition-transform" />
                                  </div>
                                </div>
                                <div className="ml-3 flex-1">
                                  <h4 className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-200 transition-colors">
                                    {result.title}
                                  </h4>
                                  <p className="text-gray-400 text-xs mt-1 group-hover:text-gray-300 transition-colors">
                                    {result.channel}
                                  </p>
                                  <p className="text-gray-500 text-xs">
                                    {result.views}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-center mb-5">
                      <div className="relative w-full max-w-md group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                        <input
                          type="text"
                          value={inputUrl}
                          onChange={(e) => setInputUrl(e.target.value)}
                          placeholder={
                            selectedPlatform === "vimeo"
                              ? "https://vimeo.com/..."
                              : "Enter video URL here..."
                          }
                          className="w-full bg-slate-800/60 border border-slate-700/50 group-focus-within:border-purple-500/50 rounded-xl py-3 px-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-0 transition-all"
                        />
                        <button
                          onClick={handleAddVideo}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white p-2 rounded-lg hover:opacity-90 transition-all"
                        >
                          <FiPlay />
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setShowPlatformSelection(true);
                      setSearchTerm("");
                      setSearchResults([]);
                    }}
                    className="text-purple-400 hover:text-purple-300 text-sm flex items-center mx-auto transition-colors group"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Back to platform selection
                  </button>
                </div>
              )}
            </div>

            {/* CUSTOM CONTROL BAR - Only show when video is playing */}
            {videoUrl && (
              <div className="h-16 bg-slate-800/60 backdrop-blur-md border-t border-slate-700/50 flex items-center justify-between px-6 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

                <div className="flex items-center space-x-4">
                  <button
                    className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/70 flex items-center justify-center transition-all border border-slate-600/50 hover:border-purple-500/30 group"
                    onClick={handlePlayPause}
                    disabled={!isHost && isLocked}
                  >
                    {isPlaying ? (
                      <FiPause className="text-white group-hover:text-purple-300 transition-colors" />
                    ) : (
                      <FiPlay className="text-white group-hover:text-purple-300 transition-colors" />
                    )}
                  </button>

                  <button
                    className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/70 flex items-center justify-center transition-all border border-slate-600/50 hover:border-purple-500/30 group"
                    onClick={handleSeekBackward}
                    disabled={!isHost && isLocked}
                  >
                    <FiSkipBack className="text-white group-hover:text-purple-300 transition-colors" />
                  </button>

                  <button
                    className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/70 flex items-center justify-center transition-all border border-slate-600/50 hover:border-purple-500/30 group"
                    onClick={handleSeekForward}
                    disabled={!isHost && isLocked}
                  >
                    <FiSkipForward className="text-white group-hover:text-purple-300 transition-colors" />
                  </button>

                  {isHost && (
                    <button
                      className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-all ${
                        isLocked
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                          : "bg-slate-700/50 text-gray-300 border border-slate-600/50 hover:bg-slate-600/70 hover:text-white"
                      }`}
                      onClick={handleToggleLock}
                    >
                      {isLocked ? (
                        <FiLock className="text-amber-400" />
                      ) : (
                        <FiUnlock />
                      )}
                      <span className="text-sm">
                        {isLocked ? "Locked" : "Unlocked"}
                      </span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {selectedPlatform === "youtube" && (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-md opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search or enter new URL..."
                        className="w-64 bg-slate-700/50 border border-slate-600/50 group-focus-within:border-purple-500/50 rounded-md py-1.5 pl-3 pr-8 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-0 transition-all"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && searchTerm.trim()) {
                            handleSearch();
                          }
                        }}
                      />
                      <button
                        onClick={handleSearch}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 p-1 rounded transition-colors cursor-pointer"
                      >
                        <FiSearch className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {selectedPlatform !== "youtube" && (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-md opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                      <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder={
                          selectedPlatform === "vimeo"
                            ? "Enter new Vimeo URL..."
                            : "Enter new video URL..."
                        }
                        className="w-64 bg-slate-700/50 border border-slate-600/50 group-focus-within:border-purple-500/50 rounded-md py-1.5 pl-3 pr-8 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-0 transition-all"
                      />
                      <button
                        onClick={handleAddVideo}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 p-1 rounded transition-colors"
                      >
                        <FiPlus className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-80 border-l border-slate-700/50 bg-slate-800/30 backdrop-blur-md flex flex-col">
            {/* TABS */}
            <div className="flex border-b border-slate-700/70">
              <button
                className={`relative flex-1 py-3 flex items-center justify-center space-x-1.5 text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "chat"
                    ? "text-purple-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("chat")}
              >
                <HiChat
                  className={
                    activeTab === "chat" ? "text-purple-400" : "text-gray-400"
                  }
                />
                <span>Chat</span>
                {activeTab === "chat" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 animate-fade-in"></span>
                )}
              </button>

              <button
                className={`relative flex-1 py-3 flex items-center justify-center space-x-1.5 text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "participants"
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("participants")}
              >
                <HiUserGroup
                  className={
                    activeTab === "participants"
                      ? "text-blue-400"
                      : "text-gray-400"
                  }
                />
                <span>
                  People
                  {participants.length > 1 && (
                    <span className="ml-1 bg-blue-500/20 text-blue-300 text-xs px-1.5 py-0.5 rounded-full">
                      {participants.length}
                    </span>
                  )}
                </span>
                {activeTab === "participants" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 animate-fade-in"></span>
                )}
              </button>

              <button
                className={`relative flex-1 py-3 flex items-center justify-center space-x-1.5 text-sm font-medium transition-all cursor-pointer ${
                  activeTab === "call"
                    ? "text-green-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("call")}
              >
                <HiVideoCamera
                  className={
                    activeTab === "call" ? "text-green-400" : "text-gray-400"
                  }
                />
                <span>Call</span>
                {activeTab === "call" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 animate-fade-in"></span>
                )}
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-hidden">
              {/* CHAT TAB */}
              {activeTab === "chat" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex flex-col ${
                          message.user === username
                            ? "items-end"
                            : "items-start"
                        } ${message.isSystem ? "items-center" : ""}`}
                      >
                        {message.isSystem ? (
                          <div className="max-w-[90%] py-1 px-3 rounded-full bg-slate-700/30 border border-slate-600/30 text-gray-400 text-xs">
                            {message.text}
                          </div>
                        ) : (
                          <div
                            className={`max-w-[85%] rounded-xl px-3 py-2 break-words overflow-hidden ${
                              message.user === username
                                ? "border text-white backdrop-blur-sm"
                                : "bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-600/50 text-white backdrop-blur-sm"
                            }`}
                            style={
                              message.user === username
                                ? {
                                    background: `linear-gradient(to bottom right, ${chatColor}20, ${chatColor}10)`,
                                    borderColor: `${chatColor}40`,
                                  }
                                : {}
                            }
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <span
                                className={`font-medium text-xs ${
                                  message.user === username
                                    ? "text-purple-300"
                                    : "text-blue-300"
                                }`}
                              >
                                {message.userId === socket.id ||
                                message.user === username
                                  ? "You"
                                  : message.user}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {message.time}
                              </span>
                            </div>
                            <p className="text-sm break-words">
                              {message.text}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-700/50 p-3">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex space-x-2"
                    >
                      <div className="relative flex-1 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="w-full bg-slate-700/50 border border-slate-600/50 group-focus-within:border-purple-500/50 rounded-lg py-2 px-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-0 transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:shadow-md hover:shadow-purple-500/10 transition-all flex items-center"
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* PARTICIPANTS TAB */}
              {activeTab === "participants" && (
                <div className="p-4 animate-fade-in h-full overflow-hidden flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xs uppercase tracking-wide text-gray-400 font-medium mb-2 flex items-center">
                      <span className="h-px w-3 bg-gray-600 mr-2"></span>
                      In This Room
                    </h3>
                    <p className="text-sm text-gray-300 flex items-center">
                      <span className="font-semibold text-blue-400 mr-1">
                        {participants.length}
                      </span>{" "}
                      {participants.length === 1 ? "person" : "people"} watching
                      together
                    </p>
                  </div>

                  <div className="overflow-y-auto hide-scrollbar flex-grow space-y-3">
                    {participants
                      .slice() // Create a copy to avoid mutation errors
                      .sort((a, b) => {
                        // Current user first
                        if (a.id === socket.id) return -1;
                        if (b.id === socket.id) return 1;
                        // Then host
                        if (a.isHost) return -1;
                        if (b.isHost) return 1;
                        // Then alphabetical
                        return a.name.localeCompare(b.name);
                      })
                      .map((participant) => (
                        <div
                          key={participant.id}
                          className="group bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm hover:from-slate-700/60 hover:to-slate-800/60 rounded-xl p-3 border border-slate-600/50 hover:border-blue-500/30 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium shadow-md shadow-blue-500/10">
                                {/* Show first letter of actual name */}
                                {participant.name ? participant.name[0] : "G"}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-white text-sm font-medium group-hover:text-blue-200 transition-colors">
                                    {/* Show name and (You) if current user */}
                                    {participant.name}
                                    {participant.id === socket.id
                                      ? " (You)"
                                      : ""}
                                  </span>
                                  {participant.isHost && (
                                    <span className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30">
                                      Host
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1 mt-1">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      participant.isMuted
                                        ? "bg-gray-500"
                                        : "bg-green-500 animate-pulse"
                                    }`}
                                  ></div>
                                  <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {participant.isMuted ? "Muted" : "Active"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* CALL TAB */}
              {activeTab === "call" && (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center mb-5 relative">
                    <HiVideoCamera className="text-green-400 w-10 h-10" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-sm animate-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text mb-3">
                    Start a Video Call
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-xs">
                    Enhance your watching experience by seeing and hearing each
                    other in real time
                  </p>
                  <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all flex items-center">
                    <HiVideoCamera className="mr-2" />
                    Join Video Call
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        roomId={roomId}
      />
      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        roomId={roomId}
        isHost={isHost}
        // Background settings
        bgColor={bgColor}
        setBgColor={setBgColor}
        bgOpacity={bgOpacity}
        setBgOpacity={setBgOpacity}
        chatColor={chatColor}
        setChatColor={setChatColor}
        selectedBackground={selectedBackground}
        setSelectedBackground={setSelectedBackground}
        customBackground={customBackground}
        setCustomBackground={setCustomBackground}
        // Video settings
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={(speed) => {
          setPlaybackSpeed(speed);
          applyVideoSettings();
        }}
        videoQuality={videoQuality}
        setVideoQuality={(quality) => {
          setVideoQuality(quality);
          applyVideoSettings();
        }}
        autoPlay={autoPlay}
        setAutoPlay={setAutoPlay}
        rememberPosition={rememberPosition}
        setRememberPosition={setRememberPosition}
        loopVideo={loopVideo}
        setLoopVideo={setLoopVideo}
      />
    </div>
  );
}
