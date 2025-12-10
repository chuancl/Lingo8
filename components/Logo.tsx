
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean, textClassName?: string }> = ({ className = "w-10 h-10", withText = true, textClassName }) => {
  return (
    <div className={`flex items-center gap-2 select-none group ${textClassName || 'text-current'}`}>
      {/* 
         Icon Design: "Linguistic Spark"
         - Base: Blue Gradient Sphere
         - Center: Sparkles/Stars
      */}
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} drop-shadow-lg transition-transform duration-500 group-hover:scale-105`}>
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
        <div className="flex items-end leading-none tracking-tight ml-1 font-sans h-12 pb-1.5 relative top-1">
            {/* 
               Design: "Fusion Glyph V2 - The Wedge & The Core"
            */}
            
            {/* Group 1: Re + 易 (Wedged) */}
            <div className="relative flex items-baseline mr-[2px]">
                <span className="text-3xl font-bold text-indigo-300 drop-shadow-sm tracking-tighter">R</span>
                <span className="text-xl font-bold text-indigo-200">e</span>
                
                {/* 易: Wedged between 'e' and 'W'. Lower position, higher z-index to overlay slightly. */}
                <span className="absolute -top-[6px] -right-[9px] text-base font-extrabold text-cyan-400 font-serif transform -rotate-12 z-20 drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)]">易</span>
            </div>

            {/* Group 2: W */}
            <span className="text-3xl font-extrabold text-white z-10 drop-shadow-md ml-0.5">W</span>

            {/* Group 3: OR (Invading d) + 语 */}
            <div className="flex flex-col justify-between h-[34px] mx-[1px] pb-[2px] relative z-20">
                {/* or: Shifted right to overlap the empty space of 'd' */}
                <span className="text-[10px] font-bold text-slate-300 uppercase leading-none tracking-tighter transform translate-x-[4px] translate-y-[2px]">or</span>
                {/* 语: Standard position */}
                <span className="text-sm font-extrabold text-fuchsia-400 font-serif leading-none drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)] transform -translate-x-[1px]">语</span>
            </div>

            {/* Group 4: Massive 'd' + '道' */}
            <div className="relative -ml-[2px]">
                {/* d: Massive size to create internal volume */}
                <span className="text-[3.2rem] font-extrabold text-white leading-[0.7] drop-shadow-md">d</span>
                
                {/* 道: Clearly visible inside the bowl of 'd' */}
                <span className="absolute bottom-[6px] left-[7px] text-[13px] font-extrabold text-amber-400 font-serif z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">道</span>
            </div>
        </div>
      )}
    </div>
  );
};
