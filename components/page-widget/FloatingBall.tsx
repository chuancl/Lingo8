
import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { PageWidgetConfig } from '../../types';

interface FloatingBallProps {
    config: PageWidgetConfig;
    badgeCount: number;
    isDragging: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onClick: (e: React.MouseEvent) => void;
}

export const FloatingBall: React.FC<FloatingBallProps> = ({ config, badgeCount, isDragging, onMouseDown, onClick }) => {
    return (
        <div 
            className={`fixed z-[2147483647] cursor-move select-none group touch-none`}
            style={{ 
                left: config.x, 
                top: config.y,
                // Ensure clicks don't fire if dragging just finished
                pointerEvents: 'auto'
            }}
            onMouseDown={onMouseDown}
            onClick={(e) => {
                // Simple prevent default to stop page interaction
                if (!isDragging) onClick(e);
            }}
        >
            {/* 
               Outer Glow / Shadow Layer 
               Separated to ensure the badge renders cleanly on top 
            */}
            <div className={`relative transition-transform duration-300 ease-out ${isDragging ? 'scale-95 cursor-grabbing' : 'hover:scale-110'}`}>
                
                {/* Main Orb */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 shadow-[0_10px_25px_-5px_rgba(59,130,246,0.5)] border border-white/20 flex items-center justify-center relative overflow-hidden backdrop-blur-md">
                    
                    {/* Glossy Reflection Effect */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-60 pointer-events-none rounded-t-full"></div>
                    
                    {/* Animated Background Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

                    {/* Icon */}
                    <div className="relative z-10 text-white drop-shadow-sm">
                        {badgeCount > 0 ? (
                            <BookOpen className="w-6 h-6 stroke-[2.5px]" />
                        ) : (
                            <Sparkles className="w-6 h-6 stroke-[2.5px] opacity-80" />
                        )}
                    </div>
                </div>

                {/* Badge - Positioned OUTSIDE the orb to avoid clipping */}
                {badgeCount > 0 && (
                    <div className="absolute -top-1 -right-1 flex items-center justify-center z-20">
                        <span className="relative flex h-5 min-w-[20px] px-1.5 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20"></span>
                            <span className="relative inline-flex rounded-full h-5 min-w-[20px] bg-red-500 border-2 border-white text-[10px] font-bold text-white items-center justify-center shadow-sm leading-none px-1">
                                {badgeCount > 99 ? '99+' : badgeCount}
                            </span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
