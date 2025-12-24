"use client";

import { useEffect, useState, useRef } from "react";
import { HiHome } from "react-icons/hi";
import Link from "next/link";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";
import {
  HiInformationCircle,
  HiCurrencyDollar,
  HiPhone,
  HiStar,
} from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeVideo, setActiveVideo] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const sectionRefs = useRef([]);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [createRoomStep, setCreateRoomStep] = useState(0); // 0: initial, 1: mode selection
  const [selectedMode, setSelectedMode] = useState(null);

  const router = useRouter();

  // Reset the modal state when closed
  const handleCloseModal = () => {
    setShowRoomModal(false);
    setCreateRoomStep(0);
    setSelectedMode(null);
  };

  const aboutSectionRef = useRef(null);

  // Function to scroll to the About section
  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const createRoom = () => {
    // Generate a random room ID
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    if (selectedMode === "watch") {
      // Navigate to watch page instead of showing modal
      router.push(`/watch/${newRoomId}`);
      setShowRoomModal(false);
    } else if (selectedMode === "meet") {
      // Similar for meet mode
      router.push(`/meet/${newRoomId}`);
      setShowRoomModal(false);
    }
  };

  useEffect(() => {
    setIsLoaded(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Set up video event listeners
  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    // Function to handle video ending
    const handleVideoEnd = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveVideo(activeVideo === 1 ? 2 : 1);
        setIsTransitioning(false);
      }, 1000);
    };

    // Set up event listeners
    if (video1) {
      video1.addEventListener("ended", handleVideoEnd);
    }

    if (video2) {
      video2.addEventListener("ended", handleVideoEnd);
    }

    return () => {
      if (video1) {
        video1.removeEventListener("ended", handleVideoEnd);
      }
      if (video2) {
        video2.removeEventListener("ended", handleVideoEnd);
      }
    };
  }, [activeVideo]);

  // Safe play function with error handling
  const safePlayVideo = async (videoRef) => {
    if (!videoRef.current) return;

    try {
      // Check if video is already playing
      if (videoRef.current.paused) {
        await videoRef.current.play();
      }
    } catch (error) {
      console.log("Video autoplay prevented by browser:", error);
      // Instead of trying to autoplay, set the video to be ready to play
      videoRef.current.currentTime = 0;
    }
  };

  // Modified effect for video switching
  useEffect(() => {
    if (activeVideo === 1) {
      safePlayVideo(video1Ref);
    } else {
      safePlayVideo(video2Ref);
    }
  }, [activeVideo]);

  // Add this - Enable videos to play after user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      // Try to play the active video after user interacts with the page
      if (activeVideo === 1) {
        safePlayVideo(video1Ref);
      } else {
        safePlayVideo(video2Ref);
      }
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [activeVideo]);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      {/* Background Image - PASTE YOUR IMAGE HERE */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/background.jpg')",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-6">
          {/* Logo - Animated Stylized TogetherTime */}
          <div className="flex items-center pl-5">
            <div className="relative logo-container">
              {/* Connecting circles icon - appears last */}
              <div className="absolute -left-8 flex space-x-1">
                <div className="w-5 h-5 rounded-full bg-blue-500 opacity-0 animate-circleOne"></div>
                <div className="w-5 h-5 rounded-full bg-pink-500 opacity-0 -ml-2 animate-circleTwo"></div>
              </div>

              {/* Stylized text */}
              <div className="font-bold text-2xl relative">
                {/* "Together" */}
                <span className="inline-block relative">
                  {"Together".split("").map((letter, index) => (
                    <span
                      key={index}
                      className="text-white inline-block opacity-0 animate-together"
                      style={{
                        animationDelay: `${0.2 + index * 0.07}s`,
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </span>

                {/* "Time" – animate from bottom */}
                <span className="relative ml-1 overflow-hidden inline-block">
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 opacity-0 animate-time">
                    Time
                  </span>
                </span>

                {/* Underline – animate from right */}
                <div className="absolute -bottom-1 right-0 h-[2px] w-full bg-gradient-to-r from-blue-500 to-purple-500 origin-right animate-underline"></div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full py-1 px-2">
            <Link
              href="/"
              className="px-4 py-2 hover:bg-slate-800/50 rounded-full transition"
            >
              <HiHome className="w-5 h-5" />
            </Link>
            <button
              className="px-5 py-2 hover:bg-slate-800/50 rounded-full transition text-sm"
              onClick={scrollToAbout}
            >
              About
            </button>
            <button className="px-5 py-2 hover:bg-slate-800/50 rounded-full transition text-sm relative group overflow-hidden">
              {/* Multi-colored shining text that's always animated */}
              <span className="relative z-10 font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 animate-text-shine">
                Go Premium
              </span>

              {/* Keep the hover effects for the background */}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
              <span className="absolute -inset-x-full top-0 bottom-0 h-full w-24 bg-white/20 skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
            </button>

            {/* Add this to your global styles */}
            <style jsx global>{`
              @keyframes text-shine {
                0% {
                  background-size: 100%;
                  background-position: 0% 50%;
                }
                50% {
                  background-size: 200%;
                  background-position: 100% 50%;
                }
                100% {
                  background-size: 100%;
                  background-position: 0% 50%;
                }
              }

              .animate-text-shine {
                animation: text-shine 3s linear infinite;
              }
            `}</style>
            <button className="px-5 py-2 hover:bg-slate-800/50 rounded-full transition text-sm">
              Sign up
            </button>
            <button className="px-5 py-2 hover:bg-slate-800/50 rounded-full transition text-sm">
              Log in
            </button>
          </div>
        </nav>

        {/* Hero Section with Subtle Background */}
        <header
          className={`relative z-10 min-h-[20vh] flex items-center px-6 md:px-12 mt-24 transition-all duration-1000 bg-black/15 backdrop-blur-[2px] ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 w-full max-w-7xl mx-auto items-center">
            {/* LEFT SIDE – VIDEO INSIDE SCREEN WITH HOVER EFFECTS */}
            <div className="relative w-full max-w-xl mx-auto md:mx-0 md:ml-auto lg:ml-4 xl:ml-10 group cursor-pointer transition-transform duration-500 hover:scale-[1.02]">
              {/* Screen glow effect - enhances on hover */}
              <div className="absolute -inset-1 bg-blue-500/10 blur-lg rounded-lg transition-all duration-500 group-hover:bg-blue-500/20 group-hover:blur-xl"></div>

              {/* Monitor container */}
              <div className="relative w-full pb-[56%] z-10">
                {/* Monitor screen - shadow enhances on hover */}
                <div className="absolute inset-0 w-full h-[99%] bg-gray-900 rounded-lg shadow-xl overflow-hidden border-[3px] border-gray-800 transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-blue-900/30">
                  {/* Top bezel with webcam - thicker than sides */}
                  <div className="absolute top-0 left-0 right-0 h-[18px] bg-black rounded-t-lg z-20">
                    {/* Webcam */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      {/* Camera lens */}
                      <div className="w-2 h-2 bg-black rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-green-500/70 rounded-full"></div>
                      </div>
                      {/* Small camera label */}
                      <div className="w-8 h-[1px] bg-gray-800 mt-[2px]"></div>
                    </div>
                    {/* Camera indicator light - blinks occasionally */}
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-1 h-1 bg-green-500/50 rounded-full animate-[blink_4s_ease-in-out_infinite]"></div>
                  </div>

                  {/* Screen bezel - adjusted for thicker top */}
                  <div className="absolute inset-0 pt-[18px] border-l-[8px] border-r-[8px] border-b-[8px] border-black rounded-b-lg overflow-hidden">
                    {/* Video loading shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 animate-shimmer"></div>

                    {/* First video */}
                    <video
                      ref={video1Ref}
                      src="/hero-demo.mp4"
                      muted
                      playsInline
                      preload="auto"
                      loop={false}
                      className={`w-full h-full object-cover absolute inset-0 transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:brightness-110 ${
                        activeVideo === 1 ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                    />

                    {/* Second video */}
                    <video
                      ref={video2Ref}
                      src="/second-video.mp4"
                      muted
                      playsInline
                      preload="auto"
                      loop={false}
                      className={`w-full h-full object-cover absolute inset-0 transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:brightness-110 ${
                        activeVideo === 2 ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                    />

                    {/* Transition overlay */}
                    <div
                      className={`absolute inset-0 bg-black z-30 transition-opacity duration-1000 pointer-events-none ${
                        isTransitioning ? "opacity-100" : "opacity-0"
                      }`}
                    ></div>

                    {/* Screen reflection overlay - enhances on hover */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none transition-opacity duration-500 group-hover:from-white/10 z-20"></div>
                  </div>

                  {/* Power indicator light - brightens on hover */}
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse transition-colors duration-300 group-hover:bg-blue-300"></div>
                </div>

                {/* Horizontal stand/base */}
                <div className="absolute bottom-0 left-[-5%] right-[-5%] h-[2%] transition-all duration-500">
                  {/* Main base - brightens slightly on hover */}
                  <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 rounded-md shadow-lg transition-colors duration-500 group-hover:from-gray-600">
                    {/* Top highlight - brightens on hover */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gray-500/80 transition-opacity duration-500 group-hover:bg-gray-400/80"></div>
                    {/* Bottom highlight */}
                    <div className="absolute bottom-0 left-[5%] right-[5%] h-[1px] bg-gray-600/50"></div>
                    {/* Center element - expands on hover */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-1 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent rounded-full transition-all duration-500 group-hover:w-12 group-hover:via-gray-500/50"></div>
                  </div>
                  {/* Connection to screen */}
                  <div className="absolute top-[-3px] left-1/2 transform -translate-x-1/2 w-[15%] h-[3px] bg-gray-700"></div>
                </div>

                {/* Surface reflection - enhances on hover */}
                <div className="absolute bottom-[-10px] left-[-3%] right-[-3%] h-[10px] bg-black/20 blur-sm rounded-[50%] transition-all duration-500 group-hover:bg-black/30"></div>
              </div>
            </div>

            {/* Add to your globals.css */}
            <style jsx global>{`
              @keyframes blink {
                0%,
                100% {
                  opacity: 0.5;
                }
                5% {
                  opacity: 1;
                }
                15% {
                  opacity: 0.5;
                }
              }
            `}</style>

            {/* RIGHT SIDE – CONTENT */}
            <div className="text-center md:text-left space-y-5 mx-auto md:mx-0 md:max-w-lg">
              {/* Emotional tag line with improved alignment - now with professional context */}
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-purple-400"></div>
                <span className="text-purple-300 text-sm font-medium tracking-wide">
                  Connect for work, life, and everything in between
                </span>
              </div>

              {/* Main heading with creative structure */}
              <h1 className="font-bold leading-tight">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-sm">
                    Make distance
                  </span>
                  <div className="flex items-center mt-1 md:mt-2">
                    <span className="text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-sm">
                      dis
                    </span>
                    <span className="relative text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500">
                      appear
                    </span>
                    <div className="w-10 h-10 ml-3 relative">
                      <div className="absolute inset-0 bg-purple-500 rounded-full opacity-20 animate-ping"></div>
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span className="text-xl">✨</span>
                      </div>
                    </div>
                  </div>
                </div>
              </h1>

              {/* Description with refined styling - now includes professional use cases */}
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border-l-2 border-purple-500/50 shadow-lg">
                <p className="text-gray-200 leading-relaxed">
                  Experience perfect sync whether you're watching movies,
                  conducting interviews, or holding team meetings. Connect
                  through video, audio, or chat and feel{" "}
                  <span className="italic font-medium text-purple-300">
                    present
                  </span>{" "}
                  no matter the distance.
                </p>
              </div>

              {/* Use case pills */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-indigo-500/20 rounded-full text-xs font-medium text-indigo-300 border border-indigo-500/30 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    ></path>
                  </svg>
                  Movie Nights
                </span>
                <span className="px-3 py-1 bg-blue-500/20 rounded-full text-xs font-medium text-blue-300 border border-blue-500/30 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                  Team Meetings
                </span>
                <span className="px-3 py-1 bg-green-500/20 rounded-full text-xs font-medium text-green-300 border border-green-500/30 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    ></path>
                  </svg>
                  Interviews
                </span>
                <span className="px-3 py-1 bg-amber-500/20 rounded-full text-xs font-medium text-amber-300 border border-amber-500/30 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    ></path>
                  </svg>
                  Training
                </span>
                <span className="px-3 py-1 bg-rose-500/20 rounded-full text-xs font-medium text-rose-300 border border-rose-500/30 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                  Long Distance
                </span>
              </div>

              {/* Main CTA that opens modal */}
              <div className="pt-4">
                <button
                  onClick={() => setShowRoomModal(true)}
                  className="relative w-full md:w-auto group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative flex items-center justify-center space-x-3 px-8 py-4 bg-gray-900 rounded-lg leading-none cursor-pointer">
                    <span className="text-purple-200 group-hover:text-white transition duration-200 font-medium">
                      Get Started
                    </span>
                    <span className="text-pink-400 group-hover:text-pink-300">
                      &rarr;
                    </span>
                  </div>
                </button>
              </div>

              {/* Right-side slide-in panel instead of full modal */}
              {showRoomModal && (
                <div className="fixed inset-y-0 right-0 z-50 flex items-center justify-end">
                  {/* Backdrop that doesn't cover the left side */}
                  <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-[2px] md:w-1/2 ml-auto"
                    onClick={handleCloseModal}
                  ></div>

                  {/* Side panel with animation */}
                  <div className="bg-slate-800/95 backdrop-blur-sm h-full w-full md:w-[420px] relative shadow-2xl border-l border-slate-700/50 overflow-y-auto animate-slide-in-right">
                    <div className="p-6 md:p-8 relative h-full">
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                        onClick={handleCloseModal}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      {/* Back button - only visible in mode selection */}
                      {createRoomStep === 1 && (
                        <button
                          className="absolute top-4 left-4 text-gray-400 hover:text-white transition flex items-center"
                          onClick={() => setCreateRoomStep(0)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">Back</span>
                        </button>
                      )}

                      <div className="mt-12 space-y-8">
                        {createRoomStep === 0 ? (
                          <>
                            {/* Initial Screen - Create or Join */}
                            <div className="text-center">
                              <h3 className="text-2xl font-bold mb-2">
                                Connect with TogetherTime
                              </h3>
                              <p className="text-gray-400 text-sm">
                                Create a new room or join an existing one
                              </p>
                            </div>

                            {/* Create Room Option */}
                            <div
                              className="bg-slate-700/40 rounded-lg p-5 hover:bg-slate-700/60 transition-colors cursor-pointer border border-transparent hover:border-pink-500/30"
                              onClick={() => setCreateRoomStep(1)}
                            >
                              <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-lg font-medium text-white">
                                    Create a Room
                                  </h4>
                                  <p className="text-gray-300 text-sm mt-1">
                                    Start a new session and invite others to
                                    join
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Join Room Option */}
                            <div className="bg-slate-700/40 rounded-lg p-5 border border-transparent hover:border-blue-500/30 hover:bg-slate-700/60 transition-colors">
                              <div className="flex items-start space-x-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-lg font-medium text-white">
                                    Join a Room
                                  </h4>
                                  <p className="text-gray-300 text-sm mt-1">
                                    Enter a code to join an existing session
                                  </p>
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  placeholder="Enter room code"
                                  className="flex-1 py-2 px-3 rounded-lg bg-black/30 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                />
                                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium">
                                  Join
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Mode Selection Screen */}
                            <div className="text-center">
                              <h3 className="text-2xl font-bold mb-2">
                                Choose Your Room Type
                              </h3>
                              <p className="text-gray-400 text-sm">
                                Select the type of experience you want to create
                              </p>
                            </div>

                            {/* Watch Mode Option */}
                            <div
                              className={`bg-slate-700/40 rounded-lg p-5 border transition-all duration-300 cursor-pointer ${
                                selectedMode === "watch"
                                  ? "border-purple-500/50 shadow-lg shadow-purple-500/10"
                                  : "border-transparent hover:border-purple-500/30 hover:bg-slate-700/60"
                              }`}
                              onClick={() => setSelectedMode("watch")}
                            >
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-medium text-white">
                                      Watch Mode
                                    </h4>
                                    {selectedMode === "watch" && (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-purple-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <p className="text-gray-300 text-sm mt-1 mb-2">
                                    Watch movies, videos, and content together
                                    with perfect synchronization
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="px-2 py-0.5 bg-indigo-500/20 rounded-full text-xs font-medium text-indigo-300">
                                      YouTube
                                    </span>
                                    <span className="px-2 py-0.5 bg-indigo-500/20 rounded-full text-xs font-medium text-indigo-300">
                                      Netflix
                                    </span>
                                    <span className="px-2 py-0.5 bg-indigo-500/20 rounded-full text-xs font-medium text-indigo-300">
                                      Video Files
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Meet Mode Option */}
                            <div
                              className={`bg-slate-700/40 rounded-lg p-5 border transition-all duration-300 cursor-pointer ${
                                selectedMode === "meet"
                                  ? "border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                                  : "border-transparent hover:border-cyan-500/30 hover:bg-slate-700/60"
                              }`}
                              onClick={() => setSelectedMode("meet")}
                            >
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-medium text-white">
                                      Meet Mode
                                    </h4>
                                    {selectedMode === "meet" && (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-cyan-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <p className="text-gray-300 text-sm mt-1 mb-2">
                                    Conduct interviews, meetings, and
                                    collaborate with multiple participants
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="px-2 py-0.5 bg-cyan-500/20 rounded-full text-xs font-medium text-cyan-300">
                                      Video Calls
                                    </span>
                                    <span className="px-2 py-0.5 bg-cyan-500/20 rounded-full text-xs font-medium text-cyan-300">
                                      Screen Share
                                    </span>
                                    <span className="px-2 py-0.5 bg-cyan-500/20 rounded-full text-xs font-medium text-cyan-300">
                                      Recordings
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Create Room Button - enabled only when a mode is selected */}
                            <div className="pt-4">
                              <button
                                onClick={selectedMode ? createRoom : null}
                                className={`w-full rounded-lg py-4 px-6 font-medium relative overflow-hidden ${
                                  selectedMode
                                    ? "bg-gradient-to-r text-white " +
                                      (selectedMode === "watch"
                                        ? "from-purple-600 to-indigo-600"
                                        : "from-blue-600 to-cyan-600")
                                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                }`}
                                disabled={!selectedMode}
                              >
                                {selectedMode && (
                                  <span className="absolute inset-0 w-full h-full">
                                    <span className="absolute inset-0 w-1/3 h-full bg-white/20 skew-x-15 transform -translate-x-full animate-shine"></span>
                                  </span>
                                )}
                                <span className="relative flex items-center justify-center">
                                  Create{" "}
                                  {selectedMode === "watch"
                                    ? "Watch"
                                    : selectedMode === "meet"
                                    ? "Meet"
                                    : ""}{" "}
                                  Room
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              </button>
                            </div>
                          </>
                        )}

                        {/* Instructions - only shown on initial screen */}
                        {createRoomStep === 0 && (
                          <div className="mt-8 px-3 py-4 bg-black/20 rounded-lg">
                            <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
                              How it works
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-300">
                              <li className="flex items-start">
                                <span className="text-blue-400 mr-2">1.</span>
                                <span>Create a room or enter a room code</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-400 mr-2">2.</span>
                                <span>
                                  Share the generated link with friends
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-400 mr-2">3.</span>
                                <span>
                                  Everyone joins and experiences perfect sync
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* About Section - Modern & Stylish with Professional Focus */}
        <section
          ref={(el) => {
            sectionRefs.current[0] = el; // Keep the original ref for animations
            aboutSectionRef.current = el; // Add our new ref for scrolling
          }}
          className="py-5 px-6 md:px-12 mt-40 md:mt-60 bg-black/15 backdrop-blur-[2px] opacity-0 translate-y-8 transition-all duration-800"
          id="about"
        >
          <div className="max-w-6xl mx-auto">
            {/* Section header with gradient accent */}
            <div className="flex flex-col items-center mb-16 relative">
              <div className="absolute -top-10 w-40 h-40 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
              <span className="text-sm uppercase tracking-wider text-purple-300 mb-4 font-medium">
                For work and play
              </span>
              <h2 className="text-3xl md:text-5xl font-bold relative text-center">
                <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                  Connect Beyond Distance
                </span>
              </h2>
              <div className="h-1 w-20 mt-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            </div>

            {/* Features grid with modern styling */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {/* Feature 1 */}
              <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="flex flex-col h-full">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center mb-5 transform group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                    Perfect Sync
                  </h3>
                  <p className="text-gray-300 leading-relaxed flex-grow">
                    Everyone sees the exact same content simultaneously, whether
                    it's a presentation, movie, or interview recording.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="flex flex-col h-full">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center mb-5 transform group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
                    Group Collaboration
                  </h3>
                  <p className="text-gray-300 leading-relaxed flex-grow">
                    Connect teams, conduct interviews, or host client meetings
                    with multi-user support and advanced moderation tools.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 hover:border-pink-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10">
                <div className="flex flex-col h-full">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-500 w-12 h-12 rounded-xl flex items-center justify-center mb-5 transform group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-pink-300 transition-colors">
                    Advanced Communication
                  </h3>
                  <p className="text-gray-300 leading-relaxed flex-grow">
                    Utilize video, audio, and text chat with screen sharing and
                    recording capabilities for interviews and training sessions.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
                <div className="flex flex-col h-full">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-5 transform group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-amber-300 transition-colors">
                    Secure Sessions
                  </h3>
                  <p className="text-gray-300 leading-relaxed flex-grow">
                    End-to-end encryption and private rooms ensure your business
                    meetings and personal connections remain confidential.
                  </p>
                </div>
              </div>
            </div>

            {/* Use Case Tabs */}
            <div className="mt-16 mb-12">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Use Case */}
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

                  <div className="flex items-start mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Stay Connected
                    </h3>
                  </div>

                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Long-distance movie nights with synchronized playback
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Family game nights across multiple locations</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Watch parties for sports events and season premieres
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Professional Use Case */}
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700/50 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-32 -mt-32"></div>

                  <div className="flex items-start mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Work Smarter
                    </h3>
                  </div>

                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Remote interviews with synchronized material review
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Client presentations with perfect media synchronization
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Team building activities and virtual company events
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-20 bg-black/15 backdrop-blur-[2px] border-t border-slate-800/40">
          {/* Main Footer Content */}
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
              {/* Logo and Description */}
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  {/* Logo */}
                  <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-lg text-white font-bold">TT</span>
                    </div>
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 blur opacity-40"></div>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                    TogetherTime
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                  Connect and share moments regardless of distance. Perfect sync
                  for entertainment, interviews, and meetings — making every
                  interaction feel natural.
                </p>

                {/* Social Links with React Icons */}
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-slate-800/70 hover:bg-purple-600/70 flex items-center justify-center transition-colors duration-300"
                  >
                    <FaTwitter className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-slate-800/70 hover:bg-purple-600/70 flex items-center justify-center transition-colors duration-300"
                  >
                    <FaFacebook className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-slate-800/70 hover:bg-purple-600/70 flex items-center justify-center transition-colors duration-300"
                  >
                    <FaInstagram className="w-4 h-4 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-slate-800/70 hover:bg-purple-600/70 flex items-center justify-center transition-colors duration-300"
                  >
                    <FaLinkedin className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>

              {/* Quick Links with React Icons */}
              <div className="md:col-span-1">
                <h4 className="text-white text-lg font-medium mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <HiHome className="w-4 h-4 text-purple-400 mr-2" />
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                    >
                      Home
                    </a>
                  </li>
                  <li className="flex items-center">
                    <HiInformationCircle className="w-4 h-4 text-purple-400 mr-2" />
                    <a
                      href="#about"
                      className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                    >
                      About
                    </a>
                  </li>
                  <li className="flex items-center">
                    <HiStar className="w-4 h-4 text-purple-400 mr-2" />
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                    >
                      Features
                    </a>
                  </li>
                  <li className="flex items-center">
                    <HiCurrencyDollar className="w-4 h-4 text-purple-400 mr-2" />
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                    >
                      Pricing
                    </a>
                  </li>
                  <li className="flex items-center">
                    <HiPhone className="w-4 h-4 text-purple-400 mr-2" />
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-300 transition-colors duration-200"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Stay Connected with React Icon */}
              <div className="md:col-span-1">
                <h4 className="text-white text-lg font-medium mb-4">
                  Stay Updated
                </h4>
                <p className="text-gray-400 mb-4">
                  Get notified about new features and updates.
                </p>

                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-slate-800/70 border border-slate-700/50 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 text-white flex-grow"
                  />
                  <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-all duration-200 hover:opacity-90 flex items-center">
                    <FaEnvelope className="mr-1 h-3 w-3" />
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent my-8"></div>

            {/* Bottom Footer */}
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400 mb-4 md:mb-0 flex items-center">
                © {new Date().getFullYear()} TogetherTime. All rights reserved
                <FaHeart className="mx-2 h-3 w-3 text-pink-500 animate-pulse" />
              </p>

              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom Glow */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        </footer>
      </div>
    </div>
  );
}
