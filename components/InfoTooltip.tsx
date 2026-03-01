import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
  className?: string;
  direction?: 'top' | 'bottom';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, className = '', direction = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Classes dinâmicas baseadas na direção
  const positionClasses = direction === 'top' 
    ? 'bottom-full mb-2 origin-bottom' 
    : 'top-full mt-2 origin-top';
    
  const arrowClasses = direction === 'top'
    ? 'top-full -mt-1 border-t-slate-900 border-b-transparent border-x-transparent'
    : 'bottom-full -mb-1 border-b-slate-900 border-t-transparent border-x-transparent';

  const animationClasses = isVisible 
    ? 'opacity-100 translate-y-0 scale-100' 
    : `opacity-0 scale-95 ${direction === 'top' ? 'translate-y-1' : '-translate-y-1'}`;

  return (
    <div className={`relative inline-flex items-center ml-1.5 ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => { 
            e.stopPropagation(); 
            setIsVisible(!isVisible); 
        }}
        className="text-slate-400 hover:text-blue-500 transition-colors focus:outline-none cursor-help p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
        aria-label="Mais informações"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      
      {/* Tooltip Popup */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-slate-600 transition-all duration-200 z-[9999] leading-relaxed text-center pointer-events-none ${positionClasses} ${animationClasses}`}
      >
        <span className="relative z-10">{text}</span>
        
        {/* Seta do tooltip */}
        <div className={`absolute left-1/2 -translate-x-1/2 border-4 ${arrowClasses}`} />
      </div>
    </div>
  );
};