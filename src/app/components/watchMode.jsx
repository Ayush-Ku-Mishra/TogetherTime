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
  FiShare2
} from "react-icons/fi";
import { HiChat, HiUserGroup, HiVideoCamera } from "react-icons/hi";
import InviteModal from "./InviteModal";

export default function WatchMode({ roomId = "ABC123", isHost = true }) {
  // State management
  const [activeTab, setActiveTab] = useState("chat");
  const [videoUrl, setVideoUrl] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [participants, setParticipants] = useState([
    { id: "1", name: "You", isHost: true, isMuted: false },
    { id: "2", name: "Alice", isHost: false, isMuted: true },
    { id: "3", name: "Bob", isHost: false, isMuted: false },
  ]);
  const [inputUrl, setInputUrl] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [showPlatformSelection, setShowPlatformSelection] = useState(true);
  
  // New state variables
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const videoPlayerRef = useRef(null);

  // YouTube search results - more dynamic mock data
  const mockSearchResults = {
    "music": [
      { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg', views: '1.2B views', channel: 'Rick Astley' },
      { id: '2Vv-BfVoq4g', title: 'Ed Sheeran - Perfect', thumbnail: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/mqdefault.jpg', views: '3.1B views', channel: 'Ed Sheeran' },
      { id: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You', thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg', views: '5.8B views', channel: 'Ed Sheeran' },
      { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg', views: '8.1B views', channel: 'Luis Fonsi' }
    ],
    "gaming": [
      { id: 'qHmfMxGSRzY', title: 'Minecraft 1.20 - Official Trailer', thumbnail: 'https://i.ytimg.com/vi/qHmfMxGSRzY/mqdefault.jpg', views: '15M views', channel: 'Minecraft' },
      { id: 'G4z_jKXeg7A', title: 'GTA 6 - Fan-Made Trailer', thumbnail: 'https://i.ytimg.com/vi/G4z_jKXeg7A/mqdefault.jpg', views: '4.3M views', channel: 'GTA Series' },
      { id: 'rn9X6VZ_cAs', title: 'Best Gaming Moments 2023', thumbnail: 'https://i.ytimg.com/vi/rn9X6VZ_cAs/mqdefault.jpg', views: '2.8M views', channel: 'GameSpot' }
    ],
    "news": [
      { id: 'bBT5HoSK5a0', title: 'Breaking News: Latest Updates', thumbnail: 'https://i.ytimg.com/vi/bBT5HoSK5a0/mqdefault.jpg', views: '1.7M views', channel: 'CNN' },
      { id: 'f8PmKpUQTHI', title: 'Tech News Weekly Roundup', thumbnail: 'https://i.ytimg.com/vi/f8PmKpUQTHI/mqdefault.jpg', views: '421K views', channel: 'TechNews' },
      { id: 'LDaC4U-zECk', title: 'Science News Highlights', thumbnail: 'https://i.ytimg.com/vi/LDaC4U-zECk/mqdefault.jpg', views: '587K views', channel: 'ScienceToday' }
    ]
  };

  // Sample messages for demo
  useEffect(() => {
    // Simulate incoming messages
    const demoMessages = [
      {
        id: 1,
        user: "Alice",
        text: "Hey everyone! Ready to watch?",
        time: "2:30 PM",
      },
    ];
    setMessages(demoMessages);
  }, []);

  const handleAddVideo = () => {
    if (inputUrl.trim() || searchTerm.trim()) {
      let videoId = inputUrl.trim() || searchTerm.trim();
      
      if (selectedPlatform === 'youtube') {
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
          videoId = videoId.split("youtube.com/embed/")[1]?.split("?")[0] || videoId;
        }
      }
      // Add handling for other platforms as needed
      
      setVideoUrl(videoId);
      setInputUrl("");
      setSearchTerm("");
      setIsPlaying(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        user: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim().includes('youtube.com') || searchTerm.trim().includes('youtu.be')) {
      // Handle as URL
      handleAddVideo();
    } else if (searchTerm.trim()) {
      // Generate somewhat dynamic search results based on search term
      let results = [];
      
      // Check if search term matches any of our categories
      if (searchTerm.toLowerCase().includes('music')) {
        results = mockSearchResults.music;
      } else if (searchTerm.toLowerCase().includes('game') || searchTerm.toLowerCase().includes('gaming')) {
        results = mockSearchResults.gaming;
      } else if (searchTerm.toLowerCase().includes('news')) {
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
      
      setSearchResults(results);
    }
  };

  const playVideo = (videoId) => {
    setVideoUrl(videoId);
    setIsPlaying(true);
    setIsSearching(false);
    setSearchTerm('');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden">
      {/* TOP BAR */}
      <div className="h-14 bg-black/50 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-4 z-10">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="relative mr-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-sm text-white font-bold">TT</span>
              </div>
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 blur opacity-40 animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              TogetherTime
            </span>
          </div>
        </div>

        {/* Media Controls */}
        <div className="flex items-center space-x-2">
          <button 
            className={`p-2 rounded-full ${isCameraMuted ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/50 text-gray-300'} hover:bg-slate-700 transition-colors`}
            onClick={() => setIsCameraMuted(!isCameraMuted)}
          >
            {isCameraMuted ? <FiVideoOff /> : <FiVideo />}
          </button>
          
          <button 
            className={`p-2 rounded-full ${isMicMuted ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/50 text-gray-300'} hover:bg-slate-700 transition-colors`}
            onClick={() => setIsMicMuted(!isMicMuted)}
          >
            {isMicMuted ? <FiMicOff /> : <FiMic />}
          </button>
          
          <button 
            className={`p-2 rounded-full ${isScreenSharing ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-gray-300'} hover:bg-slate-700 transition-colors`}
            onClick={() => setIsScreenSharing(!isScreenSharing)}
          >
            <FiMonitor />
          </button>
          
          <div className="h-6 w-px bg-slate-700/70 mx-1"></div>
          
          <div className="bg-slate-800/70 rounded-md px-3 py-1.5 text-sm flex items-center border border-slate-700/50">
            <span className="text-gray-400 mr-2">Room:</span>
            <span className="font-medium text-purple-400">{roomId}</span>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-slate-800/70 hover:bg-slate-700/70 rounded-md px-3 py-1.5 text-sm flex items-center space-x-2 border border-slate-700/50 transition-colors"
          >
            <FiShare2 className="text-purple-400" />
            <span>Invite</span>
          </button>

          <button 
            className="p-2 rounded-full bg-slate-700/50 text-gray-300 hover:bg-slate-700 transition-colors"
          >
            <FiSettings />
          </button>

          <button className="bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md px-3 py-1.5 text-sm flex items-center space-x-2 border border-red-500/30 transition-colors">
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
          <div className="bg-black flex-1 flex items-center justify-center relative">
            {videoUrl ? (
              <div className="w-full h-full">
                {selectedPlatform === 'youtube' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <iframe
                      ref={videoPlayerRef}
                      src={`https://www.youtube.com/embed/${videoUrl}?autoplay=1&enablejsapi=1`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                )}
                {selectedPlatform === 'vimeo' && (
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
                {/* Add other platform players here */}
              </div>
            ) : showPlatformSelection ? (
              // Platform selection screen
              <div className="text-center p-8 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Choose a platform to watch together
                </h3>
                
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {/* YouTube - SMALLER ICON */}
                  <div 
                    className="bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-red-500/30 rounded-lg p-4 transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      setSelectedPlatform('youtube');
                      setShowPlatformSelection(false);
                    }}
                  >
                    <div className="w-12 h-12 mx-auto mb-3 bg-red-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-white">YouTube</h4>
                    <p className="text-gray-400 text-xs mt-1">Watch videos together</p>
                  </div>
                  
                  {/* Vimeo - SMALLER ICON */}
                  <div 
                    className="bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-blue-500/30 rounded-lg p-4 transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      setSelectedPlatform('vimeo');
                      setShowPlatformSelection(false);
                    }}
                  >
                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-white">Vimeo</h4>
                    <p className="text-gray-400 text-xs mt-1">Premium content</p>
                  </div>
                  
                  {/* File Upload - SMALLER ICON */}
                  <div 
                    className="bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-green-500/30 rounded-lg p-4 transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      setSelectedPlatform('file');
                      setShowPlatformSelection(false);
                    }}
                  >
                    <div className="w-12 h-12 mx-auto mb-3 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-white">Local File</h4>
                    <p className="text-gray-400 text-xs mt-1">Upload video files</p>
                  </div>

                  {/* Direct URL - SMALLER ICON */}
                  <div 
                    className="bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-purple-500/30 rounded-lg p-4 transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      setSelectedPlatform('url');
                      setShowPlatformSelection(false);
                    }}
                  >
                    <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-white">Direct URL</h4>
                    <p className="text-gray-400 text-xs mt-1">Any video link</p>
                  </div>
                  
                  {/* Netflix - Coming Soon - SMALLER ICON */}
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 opacity-70 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs font-medium">Coming Soon</span>
                    </div>
                    <div className="w-12 h-12 mx-auto mb-3 bg-red-700/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-1.2-.624-3.85-.393-3.85-.393V0z"/>
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-white">Netflix</h4>
                    <p className="text-gray-400 text-xs mt-1">Shows and movies</p>
                  </div>

                  {/* Disney+ - Coming Soon - SMALLER ICON */}
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 opacity-70 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs font-medium">Coming Soon</span>
                    </div>
                    <div className="w-12 h-12 mx-auto mb-3 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5.75 1C5.55 1 5.351 1.05 5.17 1.1 1.33 2.3 0 6.07 0 12c0 5.93 1.33 9.7 5.17 10.9.181.05.38.1.58.1h12.5c.2 0 .399-.05.58-.1C22.67 21.7 24 17.93 24 12c0-5.93-1.33-9.7-5.17-10.9C18.649 1.05 18.45 1 18.25 1H5.75z"/>
                        <path d="M5.8 5.714c0-.316.256-.572.572-.572h11.256c.316 0 .572.256.572.572V18.286c0 .316-.256.572-.572.572H6.372a.572.572 0 01-.572-.572V5.714z" fill="#fff"/>
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-white">Disney+</h4>
                    <p className="text-gray-400 text-xs mt-1">Disney content</p>
                  </div>
                  
                  {/* Add more platforms here if needed */}
                </div>
              </div>
            ) : (
              // URL input for the selected platform
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-indigo-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  {selectedPlatform === 'youtube' && (
                    <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                  )}
                  {selectedPlatform === 'vimeo' && (
                    <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
                    </svg>
                  )}
                  {selectedPlatform === 'file' && (
                    <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                  )}
                  {selectedPlatform === 'url' && (
                    <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  )}
                  {!selectedPlatform && <FiPlay className="text-purple-400 w-6 h-6" />}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedPlatform === 'youtube' ? 'Enter YouTube Link or Search' : 
                   selectedPlatform === 'vimeo' ? 'Enter Vimeo Link' :
                   selectedPlatform === 'file' ? 'Upload Video File' :
                   selectedPlatform === 'url' ? 'Enter Video URL' :
                   'Enter Video Link'}
                </h3>
                
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  {selectedPlatform === 'youtube' ? 'Search for videos or paste a YouTube link to watch together' :
                   selectedPlatform === 'vimeo' ? 'Paste a Vimeo link to watch together with perfect sync' :
                   selectedPlatform === 'file' ? 'Upload a video file from your computer to watch together' :
                   'Paste a video link to start watching together with everyone in the room'}
                </p>
                
                {selectedPlatform === 'file' ? (
                  <div className="flex justify-center mb-4">
                    <div className="relative max-w-md w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-800/60 border-2 border-slate-700/50 border-dashed rounded-lg cursor-pointer hover:bg-slate-700/40">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <p className="mb-2 text-sm text-gray-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500">MP4, WebM or other video files (MAX. 1GB)</p>
                        </div>
                        <input type="file" className="hidden" accept="video/*" />
                      </label>
                    </div>
                  </div>
                ) : selectedPlatform === 'youtube' ? (
                  <div className="flex flex-col w-full max-w-2xl mx-auto">
                    <div className="flex items-stretch mb-4">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsSearching(e.target.value.trim() !== '');
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && searchTerm.trim()) {
                              handleSearch();
                            }
                          }}
                          placeholder="Search on YouTube or paste a link..."
                          className="w-full bg-slate-800/70 border border-slate-700/50 rounded-l-lg py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        {searchTerm && (
                          <button 
                            onClick={() => {
                              setSearchTerm('');
                              setIsSearching(false);
                              setSearchResults([]);
                            }}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={handleSearch}
                        className="bg-slate-700/70 hover:bg-slate-600/70 px-4 rounded-r-lg text-white font-medium"
                      >
                        <FiSearch className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {isSearching && searchResults.length > 0 && (
                      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden mb-6">
                        <div className="p-2 bg-slate-700/50 text-sm text-gray-300 font-medium border-b border-slate-700">
                          Search results
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {searchResults.map(result => (
                            <div 
                              key={result.id}
                              onClick={() => playVideo(result.id)}
                              className="flex p-3 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700 last:border-none"
                            >
                              <img 
                                src={result.thumbnail} 
                                alt={result.title} 
                                className="w-24 h-16 object-cover rounded"
                              />
                              <div className="ml-3 flex-1">
                                <h4 className="text-white text-sm font-medium line-clamp-2">{result.title}</h4>
                                <p className="text-gray-400 text-xs mt-1">{result.channel}</p>
                                <p className="text-gray-500 text-xs">{result.views}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center mb-4">
                    <div className="relative w-full max-w-md">
                      <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder={
                          selectedPlatform === 'vimeo' ? 'https://vimeo.com/...' : 
                          'Enter video URL here...'
                        }
                        className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      <button
                        onClick={handleAddVideo}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-md hover:opacity-90 transition-opacity"
                      >
                        <FiPlay />
                      </button>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => {
                    setShowPlatformSelection(true);
                    setSearchTerm('');
                    setSearchResults([]);
                  }}
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center mx-auto transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to platform selection
                </button>
              </div>
            )}
          </div>

          {/* CUSTOM CONTROL BAR - Only show when video is playing */}
          {videoUrl && (
            <div className="h-16 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700/50 flex items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                <button
                  className="w-10 h-10 rounded-full bg-slate-700/70 hover:bg-slate-600/70 flex items-center justify-center transition-colors"
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    // In a real implementation, we would use the YouTube/Vimeo API to control playback
                    // This is a simplified UI demonstration
                  }}
                >
                  {isPlaying ? (
                    <FiPause className="text-white" />
                  ) : (
                    <FiPlay className="text-white" />
                  )}
                </button>

                <button 
                  className="w-10 h-10 rounded-full bg-slate-700/70 hover:bg-slate-600/70 flex items-center justify-center transition-colors"
                  onClick={() => {
                    // In a real implementation, we would use the YouTube/Vimeo API to seek backward
                    // This is a simplified UI demonstration
                  }}
                >
                  <FiSkipBack className="text-white" />
                </button>

                <button 
                  className="w-10 h-10 rounded-full bg-slate-700/70 hover:bg-slate-600/70 flex items-center justify-center transition-colors"
                  onClick={() => {
                    // In a real implementation, we would use the YouTube/Vimeo API to seek forward
                    // This is a simplified UI demonstration
                  }}
                >
                  <FiSkipForward className="text-white" />
                </button>

                {isHost && (
                  <button
                    className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ${
                      isLocked
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-slate-700/50 text-gray-300 border border-slate-600/50"
                    }`}
                    onClick={() => setIsLocked(!isLocked)}
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
                {selectedPlatform === 'youtube' && (
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search or enter new URL..."
                      className="w-64 bg-slate-700/50 border border-slate-600/50 rounded-md py-1.5 pl-3 pr-8 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-slate-600/70 hover:bg-slate-500/70 text-white p-1 rounded text-sm transition-colors"
                    >
                      <FiSearch className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {selectedPlatform !== 'youtube' && (
                  <div className="relative">
                    <input
                      type="text"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder={
                        selectedPlatform === 'vimeo' ? 'Enter new Vimeo URL...' :
                        'Enter new video URL...'
                      }
                      className="w-64 bg-slate-700/50 border border-slate-600/50 rounded-md py-1.5 px-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                    />
                    <button
                      onClick={handleAddVideo}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-slate-600/70 hover:bg-slate-500/70 text-white p-1 rounded text-sm transition-colors"
                    >
                      <FiPlus />
                    </button>
                  </div>
                )}
                
                {/* Change platform button */}
                <button 
                  onClick={() => setShowPlatformSelection(true)}
                  className="bg-slate-700/50 text-gray-300 border border-slate-600/50 hover:bg-slate-600/50 px-3 py-1.5 text-sm rounded-md transition-colors"
                >
                  Change
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-80 border-l border-slate-700/50 bg-slate-800/60 backdrop-blur-sm flex flex-col">
          {/* TABS */}
          <div className="flex border-b border-slate-700/70">
            <button
              className={`flex-1 py-3 flex items-center justify-center space-x-1.5 text-sm font-medium transition-colors ${
                activeTab === "chat"
                  ? "text-purple-400 border-b-2 border-purple-500"
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
            </button>

            <button
              className={`flex-1 py-3 flex items-center justify-center space-x-1.5 text-sm font-medium transition-colors ${
                activeTab === "participants"
                  ? "text-blue-400 border-b-2 border-blue-500"
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
              <span>People</span>
            </button>

            <button
              className={`flex-1 py-3 flex items-center justify-center space-x-1.5 text-sm font-medium transition-colors ${
                activeTab === "call"
                  ? "text-green-400 border-b-2 border-green-500"
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
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-hidden">
            {/* CHAT TAB */}
            {activeTab === "chat" && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex flex-col ${
                        message.user === "You" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 ${
                          message.user === "You"
                            ? "bg-purple-500/20 border border-purple-500/30 text-white"
                            : "bg-slate-700/70 border border-slate-600/50 text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span
                            className={`font-medium text-xs ${
                              message.user === "You"
                                ? "text-purple-300"
                                : "text-blue-300"
                            }`}
                          >
                            {message.user}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {message.time}
                          </span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-700/50 p-3">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg py-2 px-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* PARTICIPANTS TAB */}
            {activeTab === "participants" && (
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                    In this room
                  </h3>
                  <p className="text-sm text-gray-300">
                    {participants.length} people watching together
                  </p>
                </div>

                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between bg-slate-700/40 rounded-lg p-3 border border-slate-600/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                          {participant.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white text-sm font-medium">
                              {participant.name}
                            </span>
                            {participant.isHost && (
                              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30">
                                Host
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 mt-0.5">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                participant.isMuted
                                  ? "bg-gray-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            <span className="text-xs text-gray-400">
                              {participant.isMuted ? "Muted" : "Active"}
                            </span>
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
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-600/30 flex items-center justify-center mb-4">
                  <HiVideoCamera className="text-green-400 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Start a Video Call
                </h3>
                <p className="text-gray-400 mb-8 max-w-xs">
                  Enhance your watching experience by seeing and hearing each
                  other
                </p>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center">
                  <HiVideoCamera className="mr-2" />
                  Join Video Call
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal with higher z-index to ensure it appears over everything */}
      <InviteModal 
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        roomId={roomId}
      />
    </div>
  );
}