
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean }> = ({ className = "w-10 h-10", withText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none group">
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} drop-shadow-md transition-transform duration-500 group-hover:rotate-12`}>
        <defs>
          <linearGradient id="aurora_gradient" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7c3aed" />   {/* Violet 600 */}
            <stop offset="50%" stopColor="#d946ef" />   {/* Fuchsia 500 */}
            <stop offset="100%" stopColor="#f97316" />  {/* Orange 500 */}
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
             <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>
        
        {/* Background Organic Shape (Squircle-ish but fluid) */}
        <path 
            d="M64 8C33.0721 8 8 33.0721 8 64C8 94.9279 33.0721 120 64 120C94.9279 120 120 94.9279 120 64C120 48.5 114 34 104 24" 
            stroke="url(#aurora_gradient)" 
            strokeWidth="12" 
            strokeLinecap="round"
            className="opacity-20"
        />

        {/* The Flow / Wave Symbol */}
        <path 
            d="M36 64C36 48 44 40 56 40C68 40 68 56 80 56C92 56 100 44 100 32" 
            stroke="url(#aurora_gradient)" 
            strokeWidth="14" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <path 
            d="M36 92C36 76 44 68 56 68C68 68 68 84 80 84C92 84 100 72 100 60" 
            stroke="url(#aurora_gradient)" 
            strokeWidth="14" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.6"
        />
        
        {/* Floating Particle */}
        <circle cx="96" cy="24" r="6" fill="#f97316" />
      </svg>
      
      {withText && (
        <div className="flex flex-col justify-center">
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-white tracking-tight leading-none font-sans">
              Lingo<span className="font-light italic text-fuchsia-200">Flow</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-bold tracking-[0.15em] mt-0.5 uppercase flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-orange-400"></span> Immersion
            </span>
        </div>
      )}
    </div>
  );
};
