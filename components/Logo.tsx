
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean }> = ({ className = "w-10 h-10", withText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none group">
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} drop-shadow-lg transition-transform duration-500 group-hover:scale-105`}>
        <defs>
          <linearGradient id="aurora_solid" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" />   {/* Indigo 500 */}
            <stop offset="50%" stopColor="#d946ef" />   {/* Fuchsia 500 */}
            <stop offset="100%" stopColor="#f97316" />  {/* Orange 500 */}
          </linearGradient>
          {/* Internal shadow for depth */}
          <filter id="inner_depth" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur stdDeviation="2" result="blur"/>
             <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"/>
             <feFlood floodColor="black" floodOpacity="0.2"/>
             <feComposite in2="shadowDiff" operator="in"/>
             <feComposite in2="SourceGraphic" operator="over" result="firstfilter"/>
             <feGaussianBlur in="firstfilter" stdDeviation="2" result="blur2"/>
             <feComposite in2="SourceGraphic" operator="in" result="secondfilter"/>
          </filter>
        </defs>
        
        {/* 1. Main Container: Solid Gradient Squircle */}
        <rect x="0" y="0" width="128" height="128" rx="32" fill="url(#aurora_solid)" />
        
        {/* 2. Subtle Glow Overlay (Top Left) */}
        <ellipse cx="40" cy="30" rx="60" ry="40" fill="white" fillOpacity="0.15" />

        {/* 3. The "Flow" Symbol (White Negative Space) */}
        <g transform="translate(26, 30)" fill="white" filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.1))">
            {/* Top Stream - Fast & Sharp */}
            <path d="M4 16C4 11.5817 7.58172 8 12 8H30C45 8 50 20 65 20H72C76.4183 20 80 16.4183 80 12C80 7.58172 76.4183 4 72 4H60C40 4 35 16 15 16H12C7.58172 16 4 16 4 16Z" opacity="0.9" />
            
            {/* Middle Stream - Main Body, flowing smoothly */}
            <path d="M0 40C0 35.5817 3.58172 32 8 32H20C40 32 48 48 68 48H86C90.4183 48 94 44.4183 94 40C94 35.5817 90.4183 32 86 32H75C70.5817 32 67 28.4183 67 24C67 19.5817 70.5817 16 75 16H88C99.0457 16 108 24.9543 108 36C108 47.0457 99.0457 56 88 56H65C45 56 38 40 18 40H8C3.58172 40 0 40 0 40Z" />

            {/* Bottom Stream - Foundation */}
            <path d="M12 64C7.58172 64 4 67.5817 4 72C4 76.4183 7.58172 80 12 80H25C45 80 50 68 70 68H76C80.4183 68 84 64.4183 84 60C84 55.5817 80.4183 52 76 52H68C48 52 42 64 22 64H12Z" opacity="0.9" />
            
            {/* Floating Particle (The Word) */}
            <circle cx="96" cy="12" r="5" fill="white" fillOpacity="0.8" />
        </g>
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
