import React from "react";
import ThemeToggle from "./ThemeToggle";

/**
 * TopBar component - Main navigation bar at the top of the application
 * Contains logo, title and theme toggle
 */
function TopBar({ isDarkMode, toggleDarkMode }) {
  return (
    <div className={`
      fixed top-0 left-0 right-0
      ${isDarkMode ? "bg-gray-800/95" : "bg-white/95"}
      backdrop-blur-sm
      shadow-lg
      transition-all duration-300
      z-20
    `}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title Section */}
          <div className="flex items-center gap-4">
            {/* Animated Logo Container */}
            <div className={`
              w-11 h-11
              rounded-xl
              flex items-center justify-center
              ${isDarkMode ? "bg-blue-600" : "bg-blue-500"}
              text-white
              transform transition-all duration-300
              hover:scale-110 hover:rotate-3
              cursor-pointer
              shadow-md hover:shadow-xl
            `}>
              <span className="text-2xl">🤖</span>
            </div>

            {/* Title and Subtitle */}
            <div className="flex flex-col">
              <h1 className={`
                text-xl font-bold
                tracking-tight
                ${isDarkMode ? "text-white" : "text-gray-800"}
                transition-colors duration-300
                hover:text-blue-500
                cursor-default
              `}>
                CS Mentor
              </h1>
              <span className={`
                text-sm font-medium
                ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                transition-colors duration-300
                -mt-1
              `}>
                AI Assistant
              </span>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <div className="flex items-center">
            <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;