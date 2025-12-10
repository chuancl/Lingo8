
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean, textClassName?: string }> = ({ className = "w-10 h-10", withText = true, textClassName }) => {
  return (
    <div className={`flex items-center gap-2 select-none group ${textClassName || 'text-current'}`}>
      {/* 
         Icon Design: "Linguistic Spark" - Enhanced
         - Base: Blue Gradient Sphere
         - Center: Animated Sparkles/Stars
         - Text: Vivid "文" and "A"
      */}
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} drop-shadow-lg transition-transform duration-500 group-hover:scale-105`}>
        <defs>
          <linearGradient id="sphere_gradient" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" />   {/* Blue 500 */}
            <stop offset="100%" stopColor="#1e3a8a" />  {/* Blue 900 */}
          </linearGradient>
          
          <filter id="star_glow" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="2.5" result="blur"/>
             <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>

          <filter id="text_shadow">
            <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
          </filter>

          <style>
            {`
              @keyframes twinkle {
                0%, 100% { opacity: 0.9; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 5px rgba(255,255,255,0.8)); }
              }
              .star-anim {
                animation: twinkle 3s infinite ease-in-out;
                transform-origin: 64px 64px;
              }
              .orbit-spin {
                 transition: stroke-opacity 0.3s;
              }
            `}
          </style>
        </defs>
        
        {/* 1. Main Background Sphere */}
        <circle cx="64" cy="64" r="60" fill="url(#sphere_gradient)" className="shadow-inner" />
        
        {/* 2. Language Particles (Vivid Colors) */}
        {/* '文' - Golden/Amber for contrast on blue */}
        <text 
            x="32" y="54" 
            fill="#fbbf24" 
            fontSize="32" 
            fontWeight="900" 
            fontFamily="serif" 
            textAnchor="middle" 
            transform="rotate(-10 32 54)"
            filter="url(#text_shadow)"
            className="drop-shadow-sm"
        >文</text>
        
        {/* 'A' - Bright Cyan/White for English */}
        <text 
            x="96" y="104" 
            fill="#a5f3fc" 
            fontSize="32" 
            fontWeight="900" 
            fontFamily="sans-serif" 
            textAnchor="middle" 
            transform="rotate(-10 96 104)"
            filter="url(#text_shadow)"
            className="drop-shadow-sm"
        >A</text>

        {/* 3. The Cycling Orbit (Arrows/Swooshes) */}
        <path 
            d="M 40 70 Q 40 40 64 36" 
            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" fill="none"
            className="orbit-spin group-hover:stroke-opacity-80"
        />
        <path 
            d="M 88 58 Q 88 88 64 92" 
            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" fill="none"
            className="orbit-spin group-hover:stroke-opacity-80"
        />
        {/* Arrow heads */}
        <path d="M 64 36 L 58 32 M 64 36 L 58 40" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" className="group-hover:stroke-opacity-80 transition-opacity"/>
        <path d="M 64 92 L 70 88 M 64 92 L 70 96" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" className="group-hover:stroke-opacity-80 transition-opacity"/>

        {/* 4. Central Sparkle Cluster (Animated) */}
        <g className="star-anim">
            {/* Main 4-point Star */}
            <path d="M 64 30 C 68 55, 74 60, 98 64 C 74 68, 68 74, 64 98 C 60 74, 54 68, 30 64 C 54 60, 60 55, 64 30 Z" fill="white" filter="url(#star_glow)" />
            
            {/* Smaller satellite stars */}
            <path d="M 96 36 L 98 32 L 100 36 L 104 38 L 100 40 L 98 44 L 96 40 L 92 38 Z" fill="#fcd34d" opacity="0.9" /> {/* Yellow tint */}
            <path d="M 32 92 L 34 88 L 36 92 L 40 94 L 36 96 L 34 100 L 32 96 L 28 94 Z" fill="#67e8f9" opacity="0.9" /> {/* Cyan tint */}
        </g>
      </svg>
      
      {withText && (
        <div className="flex items-end leading-none tracking-tight ml-2 font-sans h-14 pb-2 relative top-1">
            {/* 
               Design: "Massive Fusion Glyph"
               Structure: [Re] [W] [ord]
            */}
            
            {/* Group 1: Re + 易 */}
            <div className="relative flex items-baseline mr-0.5">
                <span className="text-5xl font-bold text-indigo-300 drop-shadow-sm tracking-tighter">R</span>
                <span className="text-3xl font-bold text-indigo-200">e</span>
                
                {/* 易: Wedged deep between e and W */}
                <span className="absolute -top-[2px] -right-[12px] text-base font-extrabold text-cyan-400 font-serif transform -rotate-12 z-20 drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)]">易</span>
            </div>

            {/* Group 2: W */}
            <span className="text-5xl font-extrabold text-white z-10 drop-shadow-md ml-1 mr-[-2px]">W</span>

            {/* Group 3: OR + 语 + d + 道 */}
            <div className="relative flex items-end ml-[-4px]">
                {/* 
                   Vertical Stack: OR (Top) + Yu (Bottom) 
                   Positioned absolutely to overlap 'd'
                */}
                <div className="absolute left-[2px] bottom-[10px] z-30 flex flex-col items-end pointer-events-none">
                    {/* or: Larger, climbing onto 'd' */}
                    <span className="text-[12px] font-bold text-slate-300 uppercase leading-none tracking-tighter transform translate-x-[14px] translate-y-[2px] rotate-[-5deg]">or</span>
                    {/* 语: Tucked underneath */}
                    <span className="text-sm font-extrabold text-fuchsia-400 font-serif leading-none drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)] mt-0.5">语</span>
                </div>

                {/* d + 道 */}
                <div className="relative">
                    {/* d: 6xl size, 'bold' (not extrabold) to make the 'o' thinner/larger inside */}
                    <span className="text-6xl font-bold text-white leading-[0.75] drop-shadow-md">d</span>
                    
                    {/* 道: Nestled inside the bowl of 'd' */}
                    <span className="absolute bottom-[9px] left-[10px] text-[13px] font-extrabold text-amber-400 font-serif z-20 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">道</span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
