
import React from 'react';
import { BookOpen, Zap } from 'lucide-react';
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
               Outer Container
            */}
            <div className={`relative transition-transform duration-300 ease-out ${isDragging ? 'scale-95 cursor-grabbing' : 'hover:scale-110'}`}>
                
                {/* Breathing Glow Background */}
                <div className="absolute inset-0 rounded-full bg-fuchsia-500 blur-md opacity-40 animate-pulse"></div>

                {/* Main Orb - Aurora Gradient (Violet -> Fuchsia -> Orange) */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 shadow-[0_8px_20px_-4px_rgba(192,38,211,0.5)] border border-white/20 flex items-center justify-center relative overflow-hidden backdrop-blur-md">
                    
                    {/* Glossy Reflection Effect (Top) */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent opacity-80 pointer-events-none rounded-t-full"></div>
                    
                    {/* Bottom Glow */}
                    <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-orange-400/50 to-transparent opacity-60 pointer-events-none"></div>

                    {/* Animated Background Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

                    {/* Icon */}
                    <div className="relative z-10 text-white drop-shadow-sm">
                        {badgeCount > 0 ? (
                            <BookOpen className="w-6 h-6 stroke-[2.5px]" />
                        ) : (
                            <Zap className="w-6 h-6 stroke-[2.5px] fill-white/20" />
                        )}
                    </div>
                </div>

                {/* Badge - Positioned OUTSIDE the orb to avoid clipping */}
                {badgeCount > 0 && (
                    <div className="absolute -top-1 -right-1 flex items-center justify-center z-20">
                        <span className="relative flex h-5 min-w-[20px] px-1.5 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-40"></span>
                            <span className="relative inline-flex rounded-full h-5 min-w-[20px] bg-gradient-to-r from-red-500 to-orange-500 border-2 border-white text-[10px] font-bold text-white items-center justify-center shadow-sm leading-none px-1">
                                {badgeCount > 99 ? '99+' : badgeCount}
                            </span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
