
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean, textClassName?: string }> = ({ className = "w-10 h-10", withText = true, textClassName }) => {
  return (
    <div className={`flex items-center gap-2 select-none group ${textClassName || 'text-zinc-100'}`}>
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
        <div className="relative h-10 w-36 ml-1 overflow-visible">
            {/* 
               ReWord Logo Art Composition
               Scaled down from original 1200x320 canvas to fit sidebar
            */}
            <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 origin-left pointer-events-none whitespace-nowrap"
                style={{ width: '1200px', height: '320px', transform: 'scale(0.12)' }}
            >
                {/* 1. R (Base) */}
                <div 
                    className="absolute font-sans font-normal leading-none text-current" 
                    style={{ fontSize: '300px', left: '0px', top: '0px', letterSpacing: '-5px', zIndex: 1, transition: 'color 0.5s' }}
                >R</div>

                {/* 2. Yi (Emerald) - 易 */}
                <div 
                    className="absolute font-serif font-bold leading-none text-emerald-400" 
                    style={{ fontSize: '130px', left: '165px', top: '-50px', transform: 'rotate(-15deg)', zIndex: 10, textShadow: '0 0 25px rgba(52, 211, 153, 0.5)', transition: 'color 0.5s' }}
                >易</div>

                {/* 3. e (Base) */}
                <div 
                    className="absolute font-sans font-normal leading-none text-current" 
                    style={{ fontSize: '220px', left: '185px', top: '100px', transform: 'rotate(25deg)', zIndex: 2, transition: 'color 0.5s' }}
                >e</div>

                {/* 4. W (Blue) */}
                <div 
                    className="absolute font-sans font-normal leading-none text-blue-400" 
                    style={{ fontSize: '300px', left: '315px', top: '0px', zIndex: 5, transition: 'color 0.5s' }}
                >W</div>

                {/* 5. O (Base) */}
                <div 
                    className="absolute font-sans font-bold leading-none text-current" 
                    style={{ fontSize: '110px', left: '640px', top: '30px', zIndex: 6, transition: 'color 0.5s' }}
                >O</div>

                {/* 6. Yu (Fuchsia) - 语 */}
                <div 
                    className="absolute font-serif font-bold leading-none text-fuchsia-400" 
                    style={{ fontSize: '85px', left: '630px', top: '160px', zIndex: 7, textShadow: '0 0 25px rgba(232, 121, 249, 0.5)', transition: 'color 0.5s' }}
                >语</div>

                {/* 7. d (Blue) - Base Body */}
                <div 
                    className="absolute font-sans font-normal leading-none text-blue-400" 
                    style={{ fontSize: '300px', left: '705px', top: '45px', zIndex: 5, transition: 'color 0.5s', fontFamily: 'Arial, sans-serif' }}
                >d</div>

                {/* 7b. l (Blue) - Neck Extension for d */}
                <div 
                    className="absolute font-sans font-normal leading-none text-blue-400" 
                    style={{ fontSize: '300px', left: '848px', top: '-125px', zIndex: 5, transition: 'color 0.5s', fontFamily: 'Arial, sans-serif' }}
                >l</div>

                {/* 8. Dao (Orange) - 道 */}
                <div 
                    className="absolute font-serif font-bold leading-none text-orange-400" 
                    style={{ fontSize: '70px', left: '740px', top: '30px', transform: 'rotate(-10deg)', zIndex: 20, textShadow: '0 0 25px rgba(251, 146, 60, 0.5)', transition: 'color 0.5s' }}
                >道</div>

                {/* 9. r (Base) - Inside d */}
                <div 
                    className="absolute font-sans font-normal leading-none text-current" 
                    style={{ fontSize: '140px', left: '785px', top: '135px', zIndex: 10, transition: 'color 0.5s' }}
                >r</div>
            </div>
        </div>
      )}
    </div>
  );
};
