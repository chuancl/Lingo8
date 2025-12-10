
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean }> = ({ className = "w-10 h-10", withText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none group">
      {/* 
         New Icon Design: "The Context Highlight" 
         Abstract representation of a word being highlighted/replaced in a sentence.
         - Grey bars: Native context/text.
         - Blue Pill: The replaced English word (The focus).
      */}
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} drop-shadow-sm transition-transform duration-500 group-hover:scale-105`}>
        <defs>
          <linearGradient id="blue_gem_gradient" x1="20" y1="20" x2="108" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />   {/* Sky 400 - Bright top-left */}
            <stop offset="100%" stopColor="#2563eb" />  {/* Blue 600 - Deep bottom-right */}
          </linearGradient>
          
          <linearGradient id="line_gradient" x1="0" y1="0" x2="128" y2="0" gradientUnits="userSpaceOnUse">
             <stop offset="0%" stopColor="#cbd5e1" />
             <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <filter id="glow_blue" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="6" result="blur"/>
             <feComposite in="blur" in2="SourceAlpha" operator="in" result="coloredBlur"/>
             <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>
        
        {/* Row 1: Context Line (Top) */}
        <rect x="24" y="32" width="80" height="12" rx="6" fill="url(#line_gradient)" opacity="0.4" />

        {/* Row 2: The Core Interaction (Middle) */}
        {/* Left Context Segment */}
        <rect x="24" y="58" width="16" height="12" rx="6" fill="url(#line_gradient)" opacity="0.4" />
        
        {/* THE GEM (The Replaced Word) - Floating & Glowing */}
        <g filter="url(#glow_blue)">
            <rect x="48" y="48" width="48" height="32" rx="10" fill="url(#blue_gem_gradient)" className="group-hover:translate-y-[-2px] transition-transform duration-500"/>
            
            {/* Subtle "Spark" or "Text" hint inside the gem */}
            <path d="M64 64 L72 64" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <path d="M72 64 L80 64" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
            
            {/* Sparkle Icon */}
            <path 
                d="M 58 56 L 60 52 L 62 56 L 66 58 L 62 60 L 60 64 L 58 60 L 54 58 Z" 
                fill="white" 
            />
        </g>

        {/* Right Context Segment */}
        <rect x="104" y="58" width="10" height="12" rx="5" fill="url(#line_gradient)" opacity="0.4" />

        {/* Row 3: Context Line (Bottom) */}
        <rect x="24" y="84" width="60" height="12" rx="6" fill="url(#line_gradient)" opacity="0.4" />

      </svg>
      
      {withText && (
        <div className="flex flex-col justify-center">
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none font-sans flex items-center">
              <span>Re</span>
              <span className="text-blue-400 mx-0.5">-</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-blue-700">Word</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] mt-1 ml-0.5 uppercase">
              易语道
            </span>
        </div>
      )}
    </div>
  );
};
