
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean, textClassName?: string }> = ({ className = "w-10 h-10", withText = true, textClassName }) => {
  return (
    <div className={`flex items-center gap-2 select-none group ${textClassName || 'text-current'}`}>
      {/* 
         Icon Design: "Linguistic Spark" - Refined V2
      */}
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} drop-shadow-lg transition-transform duration-500 group-hover:scale-105`}>
        <defs>
          <linearGradient id="sphere_gradient" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" />   {/* Blue 500 */}
            <stop offset="100%" stopColor="#1e3a8a" />  {/* Blue 900 */}
          </linearGradient>
          
          <filter id="star_glow" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="2" result="blur"/>
             <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>

          <filter id="text_shadow">
            <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.3"/>
          </filter>

          <style>
            {`
              @keyframes subtle-float {
                0%, 100% { transform: translateY(0); opacity: 0.95; }
                50% { transform: translateY(-2px); opacity: 1; filter: drop-shadow(0 0 4px rgba(255,255,255,0.7)); }
              }
              .star-anim {
                animation: subtle-float 4s ease-in-out infinite;
                transform-origin: center;
              }
            `}
          </style>
        </defs>
        
        {/* 1. Main Background Sphere */}
        <circle cx="64" cy="64" r="60" fill="url(#sphere_gradient)" className="shadow-inner" />
        
        {/* 2. Orbit Ring: Top-Right to Bottom-Left */}
        <ellipse 
            cx="64" cy="64" rx="56" ry="17" 
            stroke="white" strokeWidth="2" strokeOpacity="0.35" fill="none"
            transform="rotate(135 64 64)"
            className="group-hover:stroke-opacity-60 transition-opacity duration-500"
        />

        {/* 3. Language Particles */}
        {/* '文' - Font size reduced to 28 */}
        <text 
            x="38" y="48" 
            fill="#fbbf24" 
            fontSize="28" 
            fontWeight="900" 
            fontFamily="serif" 
            textAnchor="middle" 
            transform="rotate(-5 38 48)" 
            filter="url(#text_shadow)"
            className="drop-shadow-sm"
        >文</text>
        
        {/* 'A' - Font size reduced to 28 */}
        <text 
            x="94" y="102" 
            fill="#a5f3fc" 
            fontSize="28" 
            fontWeight="900" 
            fontFamily="sans-serif" 
            textAnchor="middle" 
            transform="rotate(-5 94 102)"
            filter="url(#text_shadow)"
            className="drop-shadow-sm"
        >A</text>

        {/* 4. Central Sparkle (Slightly Bigger) */}
        <g className="star-anim">
            {/* Main 4-point Star: Increased size (Tips moved out by ~2px: 42->40, 86->88) */}
            <path d="M 64 40 C 66 58, 70 60, 88 64 C 70 68, 66 70, 64 88 C 62 70, 58 68, 40 64 C 58 60, 62 58, 64 40 Z" fill="white" filter="url(#star_glow)" />
            
            {/* Tiny satellite dots for texture */}
            <circle cx="84" cy="54" r="1.5" fill="#fcd34d" opacity="0.8" />
            <circle cx="44" cy="74" r="1" fill="#67e8f9" opacity="0.8" />
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
