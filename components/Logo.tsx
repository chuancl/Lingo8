
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean }> = ({ className = "w-10 h-10", withText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none group">
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} drop-shadow-md transition-transform duration-500 group-hover:-rotate-3`}>
        <defs>
          <linearGradient id="brand_gradient" x1="20" y1="20" x2="108" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" />   {/* Sky 500 */}
            <stop offset="100%" stopColor="#10b981" />  {/* Emerald 500 */}
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
             <feComposite in="coloredBlur" in2="SourceGraphic" operator="out" result="glow"/>
             <feMerge>
                 <feMergeNode in="coloredBlur" result="softGlow"/>
                 <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>
        
        {/* 
           Symbol: Stylized "R" 
           - Vertical bar: Book spine / Stability
           - Curved arrow leg: "Re-" cycle / Forward motion / Transformation
        */}
        
        {/* The Spine (Left Bar) */}
        <path 
            d="M42 28 C42 23.58 38.42 20 34 20 C29.58 20 26 23.58 26 28 V100 C26 104.42 29.58 108 34 108 C38.42 108 42 104.42 42 100 V28 Z" 
            fill="url(#brand_gradient)" 
            opacity="0.9"
        />

        {/* The "Re" Curve & Leg (Right Part) */}
        <path 
            d="M42 36 H74 C 94 36, 106 48, 106 66 C 106 82, 96 92, 82 94 L 102 114 C 105 117, 104 122, 100 124 C 96 126, 92 124, 90 120 L 66 94 H 48 V 80 H 70 C 84 80, 90 74, 90 66 C 90 56, 84 52, 74 52 H 42 V 36 Z" 
            fill="url(#brand_gradient)"
        />
        
        {/* Accent Sparkle (The Idea) */}
        <circle cx="106" cy="36" r="6" fill="#38bdf8" className="animate-pulse" />

      </svg>
      
      {withText && (
        <div className="flex flex-col justify-center">
            <h1 className="text-xl font-black text-white tracking-tight leading-none font-sans">
              Re-<span className="text-emerald-300">Word</span>
            </h1>
            <span className="text-[11px] text-sky-100/90 font-bold tracking-[0.25em] mt-1.5 ml-0.5">
              易语道
            </span>
        </div>
      )}
    </div>
  );
};
