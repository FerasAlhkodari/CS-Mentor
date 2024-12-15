import React, { useState, useEffect, useRef } from "react";
import Tooltip from "./Tooltip";

/**
 * Input component for chat messages with floating/docked states and idle animations
 */
function InputBox({ messages, isDarkMode, onSendMessage, isLoading }) {
  const [input, setInput] = useState("");
  const [isFloating, setIsFloating] = useState(true); // Controls if input is floating in center or docked at bottom
  const [isIdle, setIsIdle] = useState(false); // Tracks idle state for bounce animation
  const [isFocused, setIsFocused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const idleTimerRef = useRef(null);
  const [showSendTooltip, setShowSendTooltip] = useState(false);

  // Update floating state based on messages
  useEffect(() => {
    if (messages.length === 0) {
      setIsFloating(true);
    } else {
      setIsTransitioning(true);
      setIsFloating(false);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Reset idle timer and handle idle state
  const resetIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    setIsIdle(false);
    
    idleTimerRef.current = setTimeout(() => {
      if (!isFocused) {
        setIsIdle(true);
      }
    }, 5000);
  };

  // Cleanup idle timer on unmount
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    resetIdleTimer();
  }, [input, isFocused]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    await onSendMessage(input);
    setInput("");
  };

  return (
    <div className={`
      fixed
      ${isFloating ? "top-1/2 -translate-y-1/2" : "bottom-4"}
      left-1/2 -translate-x-1/2
      w-full max-w-4xl
      px-4
      transition-all
      ${isTransitioning ? "duration-700" : "duration-300"}
      ease-in-out
      z-10
      transform
      ${isFloating ? "scale-105" : "scale-100"}
      ${isIdle && !isFocused ? "animate-gentle-bounce" : ""}
    `}
    onMouseMove={resetIdleTimer}
    onMouseEnter={() => setIsIdle(false)}
    >
      <div className={`
        p-6
        rounded-xl
        ${isDarkMode ? "bg-gray-800" : "bg-white"}
        shadow-2xl
        border
        ${isDarkMode ? "border-gray-700" : "border-gray-200"}
        transition-all duration-300
        ${isFloating ? "shadow-2xl" : "shadow-lg"}
      `}>
        <div className="flex gap-3 items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              className={`
                w-full px-4 py-3
                rounded-lg
                border-2 
                ${isDarkMode 
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" 
                  : "bg-white border-gray-200 text-gray-800 focus:border-blue-400"
                }
                focus:outline-none
                transition-all duration-300
                shadow-sm
                hover:shadow-md
                placeholder-gray-400
                ${isFloating ? "text-lg" : "text-base"}
              `}
              placeholder={isFloating ? "Ask me anything..." : "Type your message here..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              onFocus={() => {
                setIsFocused(true);
                setIsIdle(false);
              }}
              onBlur={() => {
                setIsFocused(false);
                resetIdleTimer();
              }}
            />
            {input.length > 0 && (
              <span className={`
                absolute right-3 top-1/2 -translate-y-1/2
                text-sm
                ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                transition-opacity duration-200
              `}>
                ↵
              </span>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={handleSendMessage}
              onMouseEnter={() => !isLoading && setShowSendTooltip(true)}
              onMouseLeave={() => setShowSendTooltip(false)}
              disabled={isLoading || !input.trim()}
              className={`
                px-6 py-3
                rounded-lg
                flex items-center gap-2
                font-medium
                transform
                transition-all duration-300
                ${isLoading 
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 hover:shadow-lg"
                }
                ${isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                }
                disabled:opacity-50
                disabled:cursor-not-allowed
                shadow-md
                whitespace-nowrap
                ${isFloating ? "text-lg" : "text-base"}
              `}
            >
              {isLoading ? (
                <span className="animate-spin">⌛</span>
              ) : (
                <>
                  <span className="text-lg transform transition-transform group-hover:rotate-45">🚀</span>
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
            {showSendTooltip && !isLoading && (
              <Tooltip 
                text="🚀Send message (Enter ↵)"
                position="top"
              />
            )}
          </div>
        </div>

        {/* Welcome message shown when input is floating */}
        {isFloating && (
          <div className={`
            mt-4 text-center
            ${isDarkMode ? "text-gray-400" : "text-gray-500"}
            transition-opacity duration-300
          `}>
            <p className="text-lg font-medium mb-2">
              Welcome to CS Mentor
            </p>
            <p className="text-sm">
              Start a conversation by typing your message above
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InputBox;
