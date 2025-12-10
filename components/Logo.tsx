
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean, textClassName?: string }> = ({ className = "w-10 h-10", withText = true, textClassName }) => {
  return (
    <div className={`flex items-center gap-3 select-none group ${textClassName || 'text-current'}`}>
      {/* 
         New Icon Design: "The Re-Word Block" 
         A solid, high-contrast gradient block ensures visibility on both dark and light backgrounds.
         The white symbol inside represents the "Re-" (Refresh/Cycle) nature of the learning process.
      */}
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} drop-shadow-md transition-transform duration-500 group-hover:rotate-6`}>
        <defs>
          <linearGradient id="block_gradient" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" />   {/* Blue 500 */}
            <stop offset="100%" stopColor="#0284c7" />  {/* Sky 600 */}
          </linearGradient>
          <filter id="inset_shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feComponentTransfer in="SourceAlpha">
                <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="4" />
            <feOffset dx="2" dy="4" result="offsetblur" />
            <feFlood floodColor="rgb(0, 0, 0)" floodOpacity="0.2" />
            <feComposite in2="offsetblur" operator="in" />
            <feComposite in2="SourceAlpha" operator="in" />
            <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode />
            </feMerge>
          </filter>
        </defs>
        
        {/* Main Block Background */}
        <rect x="16" y="16" width="96" height="96" rx="24" fill="url(#block_gradient)" className="group-hover:shadow-lg" />
        
        {/* Inner Symbol: Stylized "R" / Cycle / Arrow */}
        {/* This path draws an "R" where the leg is an arrow indicating transformation */}
        <path 
            d="M 48 36 V 92 M 48 36 H 72 C 88 36, 96 44, 96 58 C 96 70, 88 78, 76 80 H 48 M 74 80 L 88 94 L 98 94" 
            stroke="white" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
        />
        
        {/* The Arrow Tip on the leg */}
        <path d="M 98 94 L 88 84 M 98 94 L 88 104" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />

        {/* Shine Effect */}
        <ellipse cx="40" cy="30" rx="16" ry="8" fill="white" fillOpacity="0.2" transform="rotate(-45 40 30)" />

      </svg>
      
      {withText && (
        <div className="flex flex-col justify-center">
            {/* Using text-current to inherit color from parent (Sidebar is dark, Settings is light) */}
            <h1 className="text-xl font-extrabold tracking-tight leading-none font-sans flex items-center">
              <span>Re-Word</span>
            </h1>
            <span className="text-[10px] font-bold tracking-[0.25em] mt-1 ml-0.5 uppercase opacity-80">
              易语道
            </span>
        </div>
      )}
    </div>
  );
};
