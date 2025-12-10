
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean, textClassName?: string }> = ({ className = "w-10 h-10", withText = true, textClassName }) => {
  return (
    <div className={`flex items-center gap-3 select-none group ${textClassName || 'text-current'}`}>
      {/* 
         Icon Design: "Linguistic Spark"
         - Base: Blue Gradient Sphere
         - Center: Sparkles/Stars
         - Motion: Cycling/Orbiting lines
         - Context: '文' (Top-Left) and 'A' (Bottom-Right)
      */}
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} drop-shadow-md transition-transform duration-500 group-hover:scale-105`}>
        <defs>
          <linearGradient id="sphere_gradient" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />   {/* Blue 400 - Highlight */}
            <stop offset="100%" stopColor="#1d4ed8" />  {/* Blue 700 - Shadow */}
          </linearGradient>
          
          <filter id="star_glow" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="2" result="blur"/>
             <feComposite in="blur" in2="SourceAlpha" operator="in" result="coloredBlur"/>
             <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>
        
        {/* 1. Main Background Sphere */}
        <circle cx="64" cy="64" r="60" fill="url(#sphere_gradient)" className="shadow-inner" />
        
        {/* 2. Language Particles (Subtle) */}
        <text x="32" y="54" fill="white" fillOpacity="0.25" fontSize="28" fontWeight="bold" fontFamily="serif" textAnchor="middle" transform="rotate(-10 32 54)">文</text>
        <text x="96" y="104" fill="white" fillOpacity="0.25" fontSize="28" fontWeight="bold" fontFamily="serif" textAnchor="middle" transform="rotate(-10 96 104)">A</text>

        {/* 3. The Cycling Orbit (Arrows/Swooshes) */}
        <path 
            d="M 40 70 Q 40 40 64 36" 
            stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.6" fill="none"
            className="group-hover:stroke-opacity-90 transition-all"
        />
        <path 
            d="M 88 58 Q 88 88 64 92" 
            stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.6" fill="none"
            className="group-hover:stroke-opacity-90 transition-all"
        />
        <path d="M 64 36 L 58 32 M 64 36 L 58 40" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M 64 92 L 70 88 M 64 92 L 70 96" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.6" />

        {/* 4. Central Sparkle Cluster (With Glow) */}
        <g filter="url(#star_glow)" className="group-hover:scale-110 transition-transform origin-center duration-500">
            <path d="M 64 34 C 68 55, 74 60, 94 64 C 74 68, 68 74, 64 94 C 60 74, 54 68, 34 64 C 54 60, 60 55, 64 34 Z" fill="white" />
            <path d="M 96 36 L 98 32 L 100 36 L 104 38 L 100 40 L 98 44 L 96 40 L 92 38 Z" fill="white" fillOpacity="0.8" />
            <path d="M 32 92 L 34 88 L 36 92 L 40 94 L 36 96 L 34 100 L 32 96 L 28 94 Z" fill="white" fillOpacity="0.6" />
        </g>
      </svg>
      
      {withText && (
        <div className="flex flex-col justify-center -space-y-0.5">
            {/* English Title: Modern, Tight, Dual-Tone */}
            <h1 className="text-2xl font-sans tracking-tight leading-none flex items-center">
              <span className="font-bold opacity-90">Re</span>
              <span className="font-extrabold text-blue-500">Word</span>
              {/* Subtle accent dot */}
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-0.5 mb-1.5 animate-pulse"></span>
            </h1>
            
            {/* Chinese Subtitle: Wide tracking for elegance */}
            <span className="text-[10px] font-medium tracking-[0.4em] uppercase pl-0.5 opacity-60">
              易语道
            </span>
        </div>
      )}
    </div>
  );
};
