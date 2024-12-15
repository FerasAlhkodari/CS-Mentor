import React, { useEffect, useRef, useState } from "react";

/**
 * Tooltip component that automatically adjusts its position to stay within viewport
 * @param {string} text - The tooltip content to display
 * @param {string} position - Initial position ('top', 'bottom', 'left', 'right')
 */
function Tooltip({ text, position = "top" }) {
  const tooltipRef = useRef(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // Check if tooltip is outside viewport and adjust position if needed
  useEffect(() => {
    if (tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const rect = tooltip.getBoundingClientRect();
      
      const isOffscreenRight = rect.right > window.innerWidth;
      const isOffscreenLeft = rect.left < 0;
      const isOffscreenTop = rect.top < 0;
      const isOffscreenBottom = rect.bottom > window.innerHeight;

      if (position === "top" && isOffscreenTop) {
        setAdjustedPosition("bottom");
      } else if (position === "bottom" && isOffscreenBottom) {
        setAdjustedPosition("top");
      } else if (position === "left" && isOffscreenLeft) {
        setAdjustedPosition("right");
      } else if (position === "right" && isOffscreenRight) {
        setAdjustedPosition("left");
      }
    }
  }, [position]);

  // Get Tailwind classes for positioning based on adjusted position
  const getPosition = () => {
    switch (adjustedPosition) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }
  };

  return (
    <div
      ref={tooltipRef}
      className={`
        absolute ${getPosition()}
        px-2 py-1
        text-xs font-medium
        text-white
        bg-gray-900/90
        rounded-md
        shadow-lg
        whitespace-nowrap
        z-50
        animate-fade-in
        pointer-events-none
        backdrop-blur-sm
        transition-all duration-200
        transform
        scale-100 opacity-100
        max-w-[200px]
      `}
    >
      {text}
      {/* Arrow pointer that adjusts based on tooltip position */}
      <div className={`
        absolute
        w-2 h-2
        bg-gray-900/90
        transform rotate-45
        ${adjustedPosition === "top" ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1" : ""}
        ${adjustedPosition === "bottom" ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1" : ""}
        ${adjustedPosition === "left" ? "right-0 top-1/2 -translate-y-1/2 translate-x-1" : ""}
        ${adjustedPosition === "right" ? "left-0 top-1/2 -translate-y-1/2 -translate-x-1" : ""}
      `} />
    </div>
  );
}

export default Tooltip;