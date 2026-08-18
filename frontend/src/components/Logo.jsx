import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ showTagline = true, className = "", iconSize = "w-10 h-10" }) => {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className={`shrink-0 ${iconSize} flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-[#B9723D] dark:text-[#E89E6C] fill-none transition-transform duration-300 group-hover:scale-105"
        >
          {/* Leaf Wreath */}
          <circle cx="50" cy="50" r="38" className="stroke-current stroke-[2.5]" strokeDasharray="3 3" />

          {/* Left leaves */}
          <path d="M26 32 C20 34 18 41 22 46 C24 43 27 42 26 32 Z" className="fill-current" />
          <path d="M14 50 C9 54 8 62 13 65 C15 62 16 58 14 50 Z" className="fill-current" />
          <path d="M22 68 C19 75 22 82 28 83 C28 80 26 76 22 68 Z" className="fill-current" />

          {/* Right leaves */}
          <path d="M74 32 C80 34 82 41 78 46 C76 43 73 42 74 32 Z" className="fill-current" />
          <path d="M86 50 C91 54 92 62 87 65 C85 62 84 58 86 50 Z" className="fill-current" />
          <path d="M78 68 C81 75 78 82 72 83 C72 80 74 76 78 68 Z" className="fill-current" />

          {/* Minimalist house in center */}
          {/* Roof */}
          <path d="M34 52 L50 36 L66 52" className="stroke-current stroke-[3] stroke-linecap-round stroke-linejoin-round" />
          {/* Walls */}
          <path d="M39 52 L39 67 C39 68 40 69 41 69 L59 69 C60 69 61 68 61 67 L61 52" className="stroke-current stroke-[3] stroke-linecap-round stroke-linejoin-round" />
          {/* Heart inside house */}
          <path
            d="M50 62 C50 62 46 58.5 44 58.5 C42 58.5 40.5 60 40.5 62 C40.5 64.5 45 66.5 50 68 C55 66.5 59.5 64.5 59.5 62 C59.5 60 58 58.5 56 58.5 C54 58.5 50 62 50 62 Z"
            className="fill-current"
          />
        </svg>
      </div>
      <div className="flex flex-col select-none">
        <span className="font-outfit font-black text-2xl tracking-tight text-secondary-900 dark:text-white leading-none">
          Craft<span className="text-[#B9723D]">Nest</span>
        </span>
        {showTagline && (
          <span className="text-[7.5px] font-black tracking-[0.25em] text-[#B9723D] dark:text-[#E89E6C] uppercase leading-none mt-1.5 whitespace-nowrap">
            HANDMADE WITH LOVE
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
