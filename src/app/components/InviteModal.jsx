// components/InviteModal.jsx
"use client";
import { useState, useEffect } from 'react';
import { FiX, FiCopy, FiLink } from 'react-icons/fi';
import { FaTwitter, FaFacebook, FaWhatsapp, FaTelegram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function InviteModal({ isOpen, onClose, roomId }) {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;
  
  const inviteLink = `${window.location.origin}/watch/${roomId}`;
  
  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareUrl = encodeURIComponent(inviteLink);
  const shareTitle = encodeURIComponent(`Join my TogetherTime room!`);
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content - Now with absolute positioning */}
      <div className="relative z-[10000] w-full max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-medium leading-6 text-white">
              Invite Friends
            </h3>
            <button 
              onClick={onClose}
              className="rounded-full p-1 hover:bg-slate-700 transition-colors"
            >
              <FiX className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          
          <div>
            <p className="text-sm text-gray-400 mb-4">
              Share this link with friends to watch together
            </p>
            
            <div className="flex mb-5">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-l-lg py-2 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                onClick={copyLink}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-r-lg text-sm font-medium transition-colors flex items-center"
              >
                <FiCopy className="mr-1.5" /> 
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Share via</h4>
              <div className="grid grid-cols-3 gap-3">
                <a 
                  href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-colors"
                >
                  <FaTwitter className="text-[#1DA1F2] text-xl mb-2" />
                  <span className="text-xs text-white">Twitter</span>
                </a>
                
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-colors"
                >
                  <FaFacebook className="text-[#4267B2] text-xl mb-2" />
                  <span className="text-xs text-white">Facebook</span>
                </a>
                
                <a 
                  href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-colors"
                >
                  <FaWhatsapp className="text-[#25D366] text-xl mb-2" />
                  <span className="text-xs text-white">WhatsApp</span>
                </a>
                
                <a 
                  href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-colors"
                >
                  <FaTelegram className="text-[#0088cc] text-xl mb-2" />
                  <span className="text-xs text-white">Telegram</span>
                </a>
                
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-colors"
                >
                  <FaLinkedin className="text-[#0077b5] text-xl mb-2" />
                  <span className="text-xs text-white">LinkedIn</span>
                </a>
                
                <a 
                  href={`mailto:?subject=${shareTitle}&body=${shareUrl}`}
                  className="flex flex-col items-center justify-center bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-colors"
                >
                  <FaEnvelope className="text-gray-300 text-xl mb-2" />
                  <span className="text-xs text-white">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}