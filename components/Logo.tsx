
import React from 'react';

export const Logo: React.FC<{ className?: string, withText?: boolean }> = ({ className = "w-10 h-10", withText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none group">
      {/* 
         New Icon Design: "The Fluent R" 
         A modern, continuous line art style representing flow and transformation.
      */}
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} drop-shadow-sm transition-transform duration-500 group-hover:scale-105`}>
        <defs>
          <linearGradient id="brand_gradient_v2" x1="0" y1="0" x2="1" y2="1" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" />   {/* Sky 500 */}
            <stop offset="50%" stopColor="#06b6d4" />  {/* Cyan 500 */}
            <stop offset="100%" stopColor="#10b981" />  {/* Emerald 500 */}
          </linearGradient>
          <filter id="soft_glow" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
             <feComposite in="coloredBlur" in2="SourceGraphic" operator="out" result="glow"/>
             <feMerge>
                 <feMergeNode in="coloredBlur" result="softGlow"/>
                 <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>
        
        {/* Background Circle (Optional, subtle opacity for depth) */}
        <circle cx="64" cy="64" r="60" fill="url(#brand_gradient_v2)" opacity="0.05" />

        {/* The "R" Spine - Solid Foundation */}
        <rect x="36" y="28" width="16" height="72" rx="8" fill="url(#brand_gradient_v2)" />

        {/* The "R" Loop & Leg - The Flow */}
        <path 
            d="M 52 28 H 68 C 92 28, 104 40, 104 58 C 104 76, 90 86, 72 86 H 62 M 74 86 L 98 110" 
            stroke="url(#brand_gradient_v2)" 
            strokeWidth="16" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        
        {/* Accent Dot - The Spark of Knowledge */}
        <circle cx="106" cy="110" r="5" fill="#38bdf8" className="animate-pulse" />

      </svg>
      
      {withText && (
        <div className="flex flex-col justify-center">
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none font-sans flex items-center">
              <span>Re</span>
              <span className="text-emerald-400 mx-0.5">-</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-sky-100">Word</span>
            </h1>
            <span className="text-[10px] text-sky-200/80 font-bold tracking-[0.2em] mt-1 ml-0.5 uppercase">
              易语道
            </span>
        </div>
      )}
    </div>
  );
};
