
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
                pointerEvents: 'auto'
            }}
            onMouseDown={onMouseDown}
            onClick={(e) => {
                if (!isDragging) onClick(e);
            }}
        >
            <div className={`relative transition-transform duration-300 ease-out ${isDragging ? 'scale-95 cursor-grabbing' : 'hover:scale-110'}`}>
                
                {/* 
                   Style: "White Porcelain with Gradient Ring" 
                   Cleaner, lighter, fits on any website background.
                */}
                
                {/* 1. The Ring (Gradient Background) */}
                <div className="absolute inset-[-3px] rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 opacity-80 blur-[2px]"></div>

                {/* 2. Main Orb (Clean White) */}
                <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center relative z-10 border border-slate-100">
                    
                    {/* Icon with Gradient Fill (Simulated via text-clip if possible, or just colored text) */}
                    <div className="text-transparent bg-clip-text bg-gradient-to-br from-sky-500 to-emerald-500">
                        {badgeCount > 0 ? (
                            <BookOpen className="w-7 h-7 stroke-[2.5px] stroke-sky-500 fill-sky-50" />
                        ) : (
                            <Zap className="w-7 h-7 stroke-[2.5px] stroke-slate-300 fill-slate-50" />
                        )}
                    </div>
                </div>

                {/* Badge */}
                {badgeCount > 0 && (
                    <div className="absolute -top-1 -right-1 flex items-center justify-center z-20">
                        <span className="relative flex h-5 min-w-[20px] px-1.5 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-40"></span>
                            <span className="relative inline-flex rounded-full h-5 min-w-[20px] bg-gradient-to-r from-sky-500 to-emerald-500 border-2 border-white text-[10px] font-bold text-white items-center justify-center shadow-sm leading-none px-1">
                                {badgeCount > 99 ? '99+' : badgeCount}
                            </span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
