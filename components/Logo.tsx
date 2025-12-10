
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean }> = ({ className = "w-10 h-10", withText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none group">
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} drop-shadow-md transition-transform duration-500 group-hover:-rotate-6`}>
        <defs>
          <linearGradient id="fresh_gradient" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />   {/* Sky 400 */}
            <stop offset="100%" stopColor="#34d399" />  {/* Emerald 400 */}
          </linearGradient>
          <filter id="soft_glow" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
             <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>
        
        {/* 
           Symbol: Abstract "Flow" / "Infinity" Loop 
           Represents continuous learning and context switching.
        */}
        
        {/* Main Stroke Path */}
        <path 
            d="M32 44C32 30.7452 42.7452 20 56 20H72C85.2548 20 96 30.7452 96 44C96 52.8 91.2 60.6 84 65L44 88C36.8 92.4 32 100.2 32 109C32 119.493 40.5066 128 51 128H77C87.4934 128 96 119.493 96 109" 
            stroke="url(#fresh_gradient)" 
            strokeWidth="14" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter="url(#soft_glow)"
        />
        
        {/* Accent Dot (The 'Idea') */}
        <circle cx="96" cy="44" r="8" fill="white" />
        <circle cx="96" cy="44" r="4" fill="#38bdf8" />

      </svg>
      
      {withText && (
        <div className="flex flex-col justify-center">
            <h1 className="text-xl font-black text-white tracking-tight leading-none font-sans">
              Lingo<span className="font-light text-sky-300">Flow</span>
            </h1>
            <span className="text-[10px] text-emerald-200/80 font-bold tracking-[0.2em] mt-1 uppercase">
              Immersion
            </span>
        </div>
      )}
    </div>
  );
};
