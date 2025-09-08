import React, { useRef, useState } from 'react';

const HoverButton = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  glowColor = '#00ffc3',
  textColor = '#ffffff',
  hoverTextColor = '#67e8f9', // cyan-300 equivalent
  type = 'button'
}) => {
  const buttonRef = useRef(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setGlowPosition({ x, y });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      type={type}
      className={`
        relative px-8 py-4 border-none 
        cursor-pointer overflow-hidden transition-colors duration-300 
        text-xl rounded-lg z-10 font-sans
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        color: isHovered ? hoverTextColor : textColor,
      }}
    >
      {/* Glow effect div */}
      <div
        className={`
          absolute w-[200px] h-[200px] rounded-full opacity-50 pointer-events-none 
          transition-transform duration-400 ease-out -translate-x-1/2 -translate-y-1/2
          ${isHovered ? 'scale-120' : 'scale-0'}
        `}
        style={{
          left: `${glowPosition.x}px`,
          top: `${glowPosition.y}px`,
          background: `radial-gradient(circle, ${glowColor} 10%, transparent 70%)`,
          zIndex: -1,
        }}
      />
      
      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center gap-3">{children}</div>
    </button>
  );
};

export { HoverButton }