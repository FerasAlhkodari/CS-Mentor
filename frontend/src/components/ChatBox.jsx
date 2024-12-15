import React from "react";
import MessageBubble from "./MessageBubble";

/**
 * ChatBox component that displays a scrollable list of chat messages
 * @param {Object[]} messages - Array of message objects to display
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 */
function ChatBox({ messages, isDarkMode }) {
  return (
    // Container with flex and scrolling behavior
    <div className="flex-1 overflow-y-auto pb-32 pt-4">
      {/* Messages container with vertical spacing */}
      <div className="space-y-4">
        {/* Map through messages and render MessageBubble for each */}
        {messages.map((message) => (
          <MessageBubble
            key={message.id} // Unique key for React list rendering
            message={message} // Pass message data
            isDarkMode={isDarkMode} // Pass dark mode state
          />
        ))}
      </div>
    </div>
  );
}

export default ChatBox;
