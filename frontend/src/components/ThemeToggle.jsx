import React, { useState } from "react";
import Tooltip from "./Tooltip";

function ThemeToggle({ isDarkMode, toggleDarkMode }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDarkMode}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          p-2 rounded-lg
          transition-all duration-300
          hover:bg-gray-100 dark:hover:bg-gray-700
          group
        `}
      >
        <span className={`
          text-xl
          dark-mode-icon
          transition-transform duration-300
          group-hover:scale-110
        `}>
          {isDarkMode ? "🌙" : "☀️"}
        </span>
      </button>
      {showTooltip && (
        <Tooltip 
          text={isDarkMode ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
          position="left"
        />
      )}
    </div>
  );
}

export default ThemeToggle; 