// components/Settings.jsx
import { useState, useRef } from "react";
import {
  FiSave,
  FiImage,
  FiUser,
  FiVideo,
  FiVolume2,
  FiShield,
  FiZap,
  FiX,
  FiCheck,
} from "react-icons/fi";

export default function Settings({
  isOpen,
  onClose,
  roomId,
  isHost,
  bgColor,
  setBgColor,
  bgOpacity,
  setBgOpacity,
  chatColor,
  setChatColor,
  selectedBackground,
  setSelectedBackground,
  customBackground,
  setCustomBackground,
  // Add these new props
  playbackSpeed,
  setPlaybackSpeed,
  videoQuality,
  setVideoQuality,
  autoPlay,
  setAutoPlay,
  rememberPosition,
  setRememberPosition,
  loopVideo,
  setLoopVideo,
}) {
  const [activeTab, setActiveTab] = useState("room");

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [roomName, setRoomName] = useState("");

  const [roomPrivacy, setRoomPrivacy] = useState("public");
  const [fontSize, setFontSize] = useState("medium");

  const fileInputRef = useRef(null);

  const handlePrivacyChange = (privacy) => {
    setRoomPrivacy(privacy);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
  };

  const handleBackgroundSelect = (index) => {
    setSelectedBackground(index);
    setCustomBackground(null);
  };

  const handleCustomImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomBackground(reader.result);
        setSelectedBackground(null);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
          <h3 className="text-xl font-bold text-white">Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[500px]">
          {/* Sidebar */}
          <div className="w-48 border-r border-slate-700/50">
            <nav className="p-2 space-y-1">
              <button
                className={`flex items-center w-full p-3 rounded-lg text-left cursor-pointer ${
                  activeTab === "room"
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-gray-400 hover:bg-slate-800/80 hover:text-white"
                } transition-colors`}
                onClick={() => setActiveTab("room")}
              >
                <FiSave className="mr-3" />
                <span>Room</span>
              </button>

              <button
                className={`flex items-center w-full p-3 rounded-lg text-left cursor-pointer ${
                  activeTab === "appearance"
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-gray-400 hover:bg-slate-800/80 hover:text-white"
                } transition-colors`}
                onClick={() => setActiveTab("appearance")}
              >
                <FiImage className="mr-3" />
                <span>Appearance</span>
              </button>

              <button
                className={`flex items-center w-full p-3 rounded-lg text-left cursor-pointer ${
                  activeTab === "personal"
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-gray-400 hover:bg-slate-800/80 hover:text-white"
                } transition-colors`}
                onClick={() => setActiveTab("personal")}
              >
                <FiUser className="mr-3" />
                <span>Personal</span>
              </button>

              <button
                className={`flex items-center w-full p-3 rounded-lg text-left cursor-pointer ${
                  activeTab === "video"
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-gray-400 hover:bg-slate-800/80 hover:text-white"
                } transition-colors`}
                onClick={() => setActiveTab("video")}
              >
                <FiVideo className="mr-3" />
                <span>Video</span>
              </button>

              <button
                className={`flex items-center w-full p-3 rounded-lg text-left cursor-pointer ${
                  activeTab === "call"
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-gray-400 hover:bg-slate-800/80 hover:text-white"
                } transition-colors`}
                onClick={() => setActiveTab("call")}
              >
                <FiVolume2 className="mr-3" />
                <span>Audio/Video Call</span>
              </button>

              {isHost && (
                <button
                  className={`flex items-center w-full p-3 rounded-lg text-left ${
                    activeTab === "host"
                      ? "bg-purple-500/20 text-purple-300"
                      : "text-gray-400 hover:bg-slate-800/80 hover:text-white"
                  } transition-colors`}
                  onClick={() => setActiveTab("host")}
                >
                  <FiShield className="mr-3" />
                  <span>Host Controls</span>
                </button>
              )}

              <button
                className={`flex items-center w-full p-3 rounded-lg text-left cursor-pointer ${
                  activeTab === "performance"
                    ? "bg-purple-500/20 text-purple-300"
                    : "text-gray-400 hover:bg-slate-800/80 hover:text-white"
                } transition-colors`}
                onClick={() => setActiveTab("performance")}
              >
                <FiZap className="mr-3" />
                <span>Performance</span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Room Settings */}
            {activeTab === "room" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">
                    Room Settings
                  </h4>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Room Name
                    </label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="My Awesome Movie Night"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Give your room a name to remember it by
                    </p>
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="saveRoom"
                      className="w-4 h-4 bg-slate-800 border border-slate-700 rounded focus:ring-purple-500"
                    />
                    <label
                      htmlFor="saveRoom"
                      className="ml-2 text-sm text-white"
                    >
                      Save room to database
                    </label>
                  </div>

                  <p className="text-xs text-gray-500">
                    Temporary rooms are automatically deleted after 24 hours
                  </p>

                  <div className="mt-6 mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Room Privacy
                    </label>
                    <div className="flex space-x-3">
                      <button
                        className={`px-3 py-2 rounded-lg ${
                          roomPrivacy === "public"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-slate-800 text-gray-300 border border-slate-700 hover:bg-slate-700"
                        } transition-colors`}
                        onClick={() => handlePrivacyChange("public")}
                      >
                        Public
                      </button>
                      <button
                        className={`px-3 py-2 rounded-lg ${
                          roomPrivacy === "private"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-slate-800 text-gray-300 border border-slate-700 hover:bg-slate-700"
                        } transition-colors`}
                        onClick={() => handlePrivacyChange("private")}
                      >
                        Private
                      </button>
                      <button
                        className={`px-3 py-2 rounded-lg ${
                          roomPrivacy === "password"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-slate-800 text-gray-300 border border-slate-700 hover:bg-slate-700"
                        } transition-colors`}
                        onClick={() => handlePrivacyChange("password")}
                      >
                        Password Protected
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Maximum Participants
                    </label>
                    <select className="w-full max-w-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors">
                      <option value="5">5 people</option>
                      <option value="10">10 people</option>
                      <option value="15">15 people</option>
                      <option value="20">20 people</option>
                      <option value="unlimited">Unlimited</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">
                    Background
                  </h4>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-white cursor-pointer"
                        style={{ backgroundColor: bgColor }}
                      ></div>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="invisible w-0 h-0"
                        id="bgColorPicker"
                      />
                      <label
                        htmlFor="bgColorPicker"
                        className="text-sm text-purple-400 cursor-pointer"
                      >
                        Change color
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Background Opacity: {bgOpacity}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={bgOpacity}
                      onChange={(e) => setBgOpacity(e.target.value)}
                      className="w-full max-w-md h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <h4 className="text-lg font-medium text-white mb-4">
                    Background Image
                  </h4>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[1, 2, 3, 4, 5, 6].map((img) => (
                      <div
                        key={img}
                        className={`h-20 rounded-lg cursor-pointer bg-cover bg-center hover:opacity-90 transition-all border ${
                          selectedBackground === img
                            ? "border-2 border-purple-500"
                            : "border-slate-700"
                        } overflow-hidden relative`}
                        style={{
                          backgroundImage: `url('/bg${img}.jpg')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        onClick={() => handleBackgroundSelect(img)}
                      >
                        {selectedBackground === img && (
                          <div className="absolute inset-0 bg-purple-500/10 flex items-center justify-center">
                            <div className="bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center">
                              <FiCheck className="text-white w-4 h-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {customBackground && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-300 mb-2">
                        Custom Background
                      </h5>
                      <div className="relative h-40 rounded-lg overflow-hidden border-2 border-purple-500">
                        <img
                          src={customBackground}
                          alt="Custom background"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setCustomBackground(null)}
                          className="absolute top-2 right-2 bg-slate-900/80 text-white p-1 rounded-full hover:bg-red-500/80 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors"
                  >
                    <FiImage className="mr-2" />
                    Upload Custom Image
                  </button>
                </div>
              </div>
            )}

            {/* Personal Settings */}
            {activeTab === "personal" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">
                    Notification Settings
                  </h4>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={notificationsEnabled}
                      onChange={() =>
                        setNotificationsEnabled(!notificationsEnabled)
                      }
                      className="w-4 h-4 bg-slate-800 border border-slate-700 rounded focus:ring-purple-500"
                    />
                    <label
                      htmlFor="notifications"
                      className="ml-2 text-sm text-white"
                    >
                      Receive push notifications when someone enters the room
                    </label>
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="messageNotifications"
                      className="w-4 h-4 bg-slate-800 border border-slate-700 rounded focus:ring-purple-500"
                    />
                    <label
                      htmlFor="messageNotifications"
                      className="ml-2 text-sm text-white"
                    >
                      Receive notifications for new messages
                    </label>
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="controlNotifications"
                      className="w-4 h-4 bg-slate-800 border border-slate-700 rounded focus:ring-purple-500"
                    />
                    <label
                      htmlFor="controlNotifications"
                      className="ml-2 text-sm text-white"
                    >
                      Receive notifications for video control changes
                    </label>
                  </div>

                  <h4 className="text-lg font-medium text-white mt-6 mb-4">
                    Chat Appearance
                  </h4>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Chat Bubble Color
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-white cursor-pointer"
                        style={{ backgroundColor: chatColor }}
                      ></div>
                      <input
                        type="color"
                        value={chatColor}
                        onChange={(e) => setChatColor(e.target.value)}
                        className="invisible w-0 h-0"
                        id="chatColorPicker"
                      />
                      <label
                        htmlFor="chatColorPicker"
                        className="text-sm text-purple-400 cursor-pointer"
                      >
                        Change color
                      </label>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Chat Animation Style
                    </label>
                    <select className="w-full max-w-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors">
                      <option value="fade">Fade In</option>
                      <option value="slide">Slide In</option>
                      <option value="bounce">Bounce</option>
                      <option value="none">No Animation</option>
                    </select>
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Font Size
                    </label>
                    <div className="flex space-x-3">
                      <button
                        className={`px-3 py-2 rounded-lg ${
                          fontSize === "small"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-slate-800 text-gray-300 border border-slate-700 hover:bg-slate-700"
                        } transition-colors`}
                        onClick={() => handleFontSizeChange("small")}
                      >
                        Small
                      </button>
                      <button
                        className={`px-3 py-2 rounded-lg ${
                          fontSize === "medium"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-slate-800 text-gray-300 border border-slate-700 hover:bg-slate-700"
                        } transition-colors`}
                        onClick={() => handleFontSizeChange("medium")}
                      >
                        Medium
                      </button>
                      <button
                        className={`px-3 py-2 rounded-lg ${
                          fontSize === "large"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-slate-800 text-gray-300 border border-slate-700 hover:bg-slate-700"
                        } transition-colors`}
                        onClick={() => handleFontSizeChange("large")}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* More tabs would go here */}
            {activeTab === "video" && (
              <div className="space-y-6 animate-fade-in">
                <h4 className="text-lg font-medium text-white mb-4">
                  Video Playback Settings
                </h4>

                {/* Playback Preferences */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-300 mb-3">
                    Playback Preferences
                  </h5>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      Default Playback Speed
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["0.5", "0.75", "1", "1.25", "1.5", "2"].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            speed === playbackSpeed
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : "bg-slate-800 text-gray-300 border border-slate-700 hover:bg-slate-700"
                          } transition-colors`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoPlay"
                        checked={autoPlay}
                        onChange={(e) => setAutoPlay(e.target.checked)}
                        className="w-4 h-4 bg-slate-800 border border-slate-700 rounded focus:ring-purple-500"
                      />
                      <label
                        htmlFor="autoPlay"
                        className="ml-2 text-sm text-white"
                      >
                        Auto-play when video is loaded
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rememberPosition"
                        checked={rememberPosition}
                        onChange={(e) => setRememberPosition(e.target.checked)}
                        className="w-4 h-4 bg-slate-800 border border-slate-700 rounded focus:ring-purple-500"
                      />
                      <label
                        htmlFor="rememberPosition"
                        className="ml-2 text-sm text-white"
                      >
                        Remember playback position
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="loopVideo"
                        checked={loopVideo}
                        onChange={(e) => setLoopVideo(e.target.checked)}
                        className="w-4 h-4 bg-slate-800 border border-slate-700 rounded focus:ring-purple-500"
                      />
                      <label
                        htmlFor="loopVideo"
                        className="ml-2 text-sm text-white"
                      >
                        Loop video when finished
                      </label>
                    </div>
                  </div>
                </div>

                {/* Video Quality */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-300 mb-3">
                    Video Quality
                  </h5>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      Default Quality
                    </label>
                    <select
                      value={videoQuality}
                      onChange={(e) => setVideoQuality(e.target.value)}
                      className="w-full max-w-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="auto">Auto</option>
                      <option value="240p">240p</option>
                      <option value="360p">360p</option>
                      <option value="480p">480p</option>
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                      <option value="4k">4K (if available)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "call" && (
              <div className="space-y-6 animate-fade-in">
                <h4 className="text-lg font-medium text-white mb-4">
                  Audio/Video Call Settings
                </h4>
                {/* Call settings content */}
              </div>
            )}

            {activeTab === "host" && (
              <div className="space-y-6 animate-fade-in">
                <h4 className="text-lg font-medium text-white mb-4">
                  Host Control Settings
                </h4>
                {/* Host settings content */}
              </div>
            )}

            {activeTab === "performance" && (
              <div className="space-y-6 animate-fade-in">
                <h4 className="text-lg font-medium text-white mb-4">
                  Performance & Accessibility
                </h4>
                {/* Performance settings content */}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-transparent text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
