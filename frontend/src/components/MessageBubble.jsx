import React from "react";

/**
 * MessageBubble component that renders chat messages with different styles
 * based on whether it's from the bot or user, and handles typing/error states
 */
function MessageBubble({ message, isDarkMode }) {
  // Extract message properties
  const isBot = message.role === "bot";
  const isTyping = message.isTyping; 
  const isError = message.isError;

  return (
    <div className={`
      flex
      ${isBot ? "justify-start" : "justify-end"}
    `}>
      {/* Message bubble container with conditional styling */}
      <div className={`
        max-w-[80%]
        rounded-2xl
        px-4 py-2
        ${isBot
          ? isDarkMode
            ? isTyping
              ? "bg-gray-700 animate-pulse"
              : isError
                ? "bg-red-600/90"
                : "bg-gray-700"
            : isTyping
              ? "bg-gray-100 animate-pulse"
              : isError
                ? "bg-red-500/90"
                : "bg-gray-100"
          : isDarkMode
            ? "bg-blue-600"
            : "bg-blue-500"
        }
        ${isBot
          ? isDarkMode
            ? "text-gray-200"
            : "text-gray-800"
          : "text-white"
        }
        transition-colors duration-200
      `}>
        {/* Message text content */}
        <p className={`
          whitespace-pre-wrap
          ${isTyping ? "opacity-70" : ""}
        `}>
          {message.text}
        </p>

        {/* Timestamp display (only shown for non-typing messages) */}
        {message.timestamp && !isTyping && (
          <div className={`
            text-xs mt-1
            ${isBot
              ? isDarkMode
                ? "text-gray-400"
                : "text-gray-500"
              : "text-blue-100"
            }
          `}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
