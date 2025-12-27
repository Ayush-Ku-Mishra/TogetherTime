// components/InviteModal.jsx
"use client";
import { useState, useEffect } from "react";
import { FiX, FiCopy, FiLink, FiDownload } from "react-icons/fi";
import {
  FaTwitter,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
  FaLinkedin,
  FaEnvelope,
  FaQrcode,
} from "react-icons/fa";

export default function InviteModal({ isOpen, onClose, roomId }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("share"); // 'share' or 'qr'

  if (!isOpen) return null;

  const inviteLink = `${window.location.origin}/watch/${roomId}?guest=true`;

  // QR code URL with margin parameter to ensure visibility
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(
    inviteLink
  )}`;

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = encodeURIComponent(inviteLink);
  const shareTitle = encodeURIComponent(`Join my TogetherTime room!`);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with animated gradient */}
      <div
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-[10000] w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-slate-800 z-0"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-600/20 blur-xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-blue-600/20 blur-xl"></div>

        {/* Modal content */}
        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Invite Friends
              </h3>
              <p className="text-sm text-gray-300 mt-1">
                Share your room with others to watch together
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-white"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Tab navigation */}
          <div className="flex mb-6 bg-slate-700/30 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("share")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "share"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Share Link
            </button>
            <button
              onClick={() => setActiveTab("qr")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "qr"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              QR Code
            </button>
          </div>

          {activeTab === "share" ? (
            <div className="space-y-6 animate-fade-in">
              {/* Link section with shimmering effect */}
              <div className="group relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 opacity-50"></div>
                <div className="relative z-10 flex overflow-hidden border border-slate-700/50 rounded-xl">
                  <input
                    type="text"
                    readOnly
                    value={inviteLink}
                    className="flex-1 bg-slate-800/90 py-3 px-4 text-white text-sm focus:outline-none border-none"
                  />
                  <button
                    onClick={copyLink}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 font-medium transition-all flex items-center"
                  >
                    <FiCopy
                      className={`mr-2 transition-all ${
                        copied ? "text-green-300" : "text-white"
                      }`}
                    />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="absolute inset-0 w-1/2 h-full bg-white/10 transform -skew-x-12 -translate-x-full animate-shimmer-slow pointer-events-none group-hover:animate-shimmer-fast"></div>
              </div>

              {/* Share options */}
              <div>
                <h4 className="text-sm font-bold text-white mb-4 flex items-center">
                  <span className="h-px flex-grow bg-gradient-to-r from-transparent to-slate-600 mr-3"></span>
                  Share via
                  <span className="h-px flex-grow bg-gradient-to-l from-transparent to-slate-600 ml-3"></span>
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  {/* Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center rounded-xl p-3 transition-all overflow-hidden hover:scale-105 bg-gradient-to-br from-slate-800 to-slate-700 hover:from-[#1DA1F2]/20 hover:to-[#1DA1F2]/5 border border-slate-700 hover:border-[#1DA1F2]/30"
                  >
                    <div className="absolute inset-0 bg-[#1DA1F2]/0 group-hover:bg-[#1DA1F2]/5 transition-all"></div>
                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#1DA1F2]/10 mb-2 group-hover:bg-[#1DA1F2]/20 group-hover:shadow-lg group-hover:shadow-[#1DA1F2]/10">
                      <FaTwitter className="text-[#1DA1F2] text-xl" />
                    </div>
                    <span className="text-xs text-white font-medium">
                      Twitter
                    </span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center rounded-xl p-3 transition-all overflow-hidden hover:scale-105 bg-gradient-to-br from-slate-800 to-slate-700 hover:from-[#4267B2]/20 hover:to-[#4267B2]/5 border border-slate-700 hover:border-[#4267B2]/30"
                  >
                    <div className="absolute inset-0 bg-[#4267B2]/0 group-hover:bg-[#4267B2]/5 transition-all"></div>
                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#4267B2]/10 mb-2 group-hover:bg-[#4267B2]/20 group-hover:shadow-lg group-hover:shadow-[#4267B2]/10">
                      <FaFacebook className="text-[#4267B2] text-xl" />
                    </div>
                    <span className="text-xs text-white font-medium">
                      Facebook
                    </span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center rounded-xl p-3 transition-all overflow-hidden hover:scale-105 bg-gradient-to-br from-slate-800 to-slate-700 hover:from-[#25D366]/20 hover:to-[#25D366]/5 border border-slate-700 hover:border-[#25D366]/30"
                  >
                    <div className="absolute inset-0 bg-[#25D366]/0 group-hover:bg-[#25D366]/5 transition-all"></div>
                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#25D366]/10 mb-2 group-hover:bg-[#25D366]/20 group-hover:shadow-lg group-hover:shadow-[#25D366]/10">
                      <FaWhatsapp className="text-[#25D366] text-xl" />
                    </div>
                    <span className="text-xs text-white font-medium">
                      WhatsApp
                    </span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center rounded-xl p-3 transition-all overflow-hidden hover:scale-105 bg-gradient-to-br from-slate-800 to-slate-700 hover:from-[#0088cc]/20 hover:to-[#0088cc]/5 border border-slate-700 hover:border-[#0088cc]/30"
                  >
                    <div className="absolute inset-0 bg-[#0088cc]/0 group-hover:bg-[#0088cc]/5 transition-all"></div>
                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#0088cc]/10 mb-2 group-hover:bg-[#0088cc]/20 group-hover:shadow-lg group-hover:shadow-[#0088cc]/10">
                      <FaTelegram className="text-[#0088cc] text-xl" />
                    </div>
                    <span className="text-xs text-white font-medium">
                      Telegram
                    </span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center rounded-xl p-3 transition-all overflow-hidden hover:scale-105 bg-gradient-to-br from-slate-800 to-slate-700 hover:from-[#0077b5]/20 hover:to-[#0077b5]/5 border border-slate-700 hover:border-[#0077b5]/30"
                  >
                    <div className="absolute inset-0 bg-[#0077b5]/0 group-hover:bg-[#0077b5]/5 transition-all"></div>
                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[#0077b5]/10 mb-2 group-hover:bg-[#0077b5]/20 group-hover:shadow-lg group-hover:shadow-[#0077b5]/10">
                      <FaLinkedin className="text-[#0077b5] text-xl" />
                    </div>
                    <span className="text-xs text-white font-medium">
                      LinkedIn
                    </span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:?subject=${shareTitle}&body=${shareUrl}`}
                    className="group relative flex flex-col items-center justify-center rounded-xl p-3 transition-all overflow-hidden hover:scale-105 bg-gradient-to-br from-slate-800 to-slate-700 hover:from-gray-500/20 hover:to-gray-500/5 border border-slate-700 hover:border-gray-500/30"
                  >
                    <div className="absolute inset-0 bg-gray-500/0 group-hover:bg-gray-500/5 transition-all"></div>
                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-500/10 mb-2 group-hover:bg-gray-500/20 group-hover:shadow-lg group-hover:shadow-gray-500/10">
                      <FaEnvelope className="text-gray-300 group-hover:text-white text-xl" />
                    </div>
                    <span className="text-xs text-white font-medium">
                      Email
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-fade-in">
              {/* QR Code Section - FIXED */}
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-1 rounded-xl mb-4 shadow-lg">
                <div className="bg-white p-3 rounded-lg">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="w-[200px] h-[200px] block"
                  />
                </div>
              </div>

              <p className="text-gray-300 text-sm text-center mb-4 max-w-xs">
                Scan this QR code with your camera to join this room from your
                mobile device
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    // Download QR code image
                    const link = document.createElement("a");
                    link.href = qrCodeUrl;
                    link.download = `togethertime-room-${roomId}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg text-white text-sm font-medium transition-colors flex items-center"
                >
                  <FiDownload className="w-4 h-4 mr-2" />
                  Download
                </button>

                <button
                  onClick={copyLink}
                  className="py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center"
                >
                  <FiCopy className="mr-2" />
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
