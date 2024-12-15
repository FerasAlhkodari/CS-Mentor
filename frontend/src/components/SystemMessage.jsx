import React from "react";

function SystemMessage({ message, isDarkMode }) {
  if (!message) return null;

  const getBackgroundColor = () => {
    switch (message.type) {
      case 'success':
        return isDarkMode 
          ? 'bg-green-600/90 border-green-700' 
          : 'bg-green-500/90 border-green-600';
      case 'error':
        return isDarkMode 
          ? 'bg-red-600/95 border-red-700' 
          : 'bg-red-500/95 border-red-600';
      case 'warning':
        return isDarkMode 
          ? 'bg-amber-600/95 border-amber-700'
          : 'bg-amber-500/95 border-amber-600';
      default:
        return isDarkMode 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/90 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return message.text.includes('deleted') ? '🗑️' : '⚠️';
      default:
        return '🔔';
    }
  };

  return (
    <div className={`
      sticky top-0
      py-2 px-4
      text-center
      z-50
      transition-all duration-300
      transform
      animate-fade-in
      ${getBackgroundColor()}
      backdrop-blur-sm
      border-b
      text-white
      shadow-lg
    `}>
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
        <span className="text-lg">{getIcon()}</span>
        <span className="text-sm font-medium">{message.text}</span>
      </div>
    </div>
  );
}

export default SystemMessage; 