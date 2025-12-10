
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean }> = ({ className = "w-10 h-10", withText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="logo_gradient" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" /> {/* Blue 600 */}
            <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan 500 */}
          </linearGradient>
          <filter id="logo_shadow" x="-20%" y="-20%" width="140%" height="140%">
             <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.15" />
          </filter>
        </defs>
        
        {/* Main Container Squircle */}
        <rect x="8" y="8" width="112" height="112" rx="28" fill="url(#logo_gradient)" filter="url(#logo_shadow)" />
        
        {/* Stylized 'C' - Abstract Context Layers */}
        {/* Outer arc representing Context */}
        <path d="M88 44C83 36 74 32 64 32C46.3269 32 32 46.3269 32 64C32 81.6731 46.3269 96 64 96C74 96 83 92 88 84" stroke="white" strokeWidth="12" strokeLinecap="round" />
        
        {/* Inner Context Dot representing the 'Word' being learned */}
        <circle cx="64" cy="64" r="9" fill="white" />
        
        {/* Decorative small dot for 'Immersion' connection */}
        <circle cx="92" cy="64" r="6" fill="white" fillOpacity="0.4" />
      </svg>
      
      {withText && (
        <div className="flex flex-col justify-center">
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none font-sans">
              Context<span className="text-cyan-200">Lingo</span>
            </h1>
            <span className="text-[10px] text-blue-200/80 font-bold tracking-[0.2em] mt-1 uppercase">
              Immersion
            </span>
        </div>
      )}
    </div>
  );
};
