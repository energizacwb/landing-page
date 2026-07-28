import React from 'react';

interface EnergizaLogoProps {
  className?: string;
  showText?: boolean;
  textColorClass?: string;
  subtextColorClass?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function EnergizaLogo({ 
  className = '', 
  showText = true, 
  textColorClass = 'text-[#1e293b]', 
  subtextColorClass = 'text-[#64748b]',
  size = 'md'
}: EnergizaLogoProps) {
  
  const sizeMap = {
    sm: { logo: 'w-8 h-8', font: 'text-lg', sub: 'text-[9px]' },
    md: { logo: 'w-12 h-12', font: 'text-xl', sub: 'text-[11px]' },
    lg: { logo: 'w-16 h-16', font: 'text-2xl', sub: 'text-xs' },
    xl: { logo: 'w-24 h-24', font: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Dynamic S Wave SVG Logo */}
      <svg 
        className={`${currentSize.logo} shrink-0`} 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="energiza-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff00cc" />
            <stop offset="50%" stopColor="#9900ff" />
            <stop offset="100%" stopColor="#00ccff" />
          </linearGradient>
        </defs>
        
        {/* Main stylized fluid S wave path matching the uploaded image */}
        <path 
          d="M 120,40 
             C 145,40 170,55 170,85 
             C 170,115 130,125 100,145 
             C 80,158 55,145 55,120 
             C 55,95 85,85 110,65 
             C 120,57 115,40 100,40 
             C 80,40 60,60 60,85 
             C 60,115 100,125 130,145 
             C 150,158 175,145 175,120 
             C 175,90 145,40 120,40 Z" 
          fill="url(#energiza-grad)" 
        />
        
        {/* Supporting crescent swooshes at the bottom left for depth */}
        <path 
          d="M 60,105 C 60,125 80,145 110,145 C 80,145 60,125 60,105 Z" 
          fill="url(#energiza-grad)" 
          opacity="0.8"
        />
        <path 
          d="M 80,135 C 80,150 100,165 140,160 C 100,165 80,150 80,135 Z" 
          fill="url(#energiza-grad)" 
          opacity="0.9"
        />
      </svg>

      {showText && (
        <div className="flex flex-col select-none">
          <span className={`font-black tracking-tight ${textColorClass} ${currentSize.font}`}>
            ENERGIZA
          </span>
          <span className={`font-bold tracking-[0.25em] -mt-1 ${subtextColorClass} ${currentSize.sub}`}>
            SOLUÇÕES
          </span>
        </div>
      )}
    </div>
  );
}
