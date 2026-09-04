import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div
      className={`bg-slate-900/75 backdrop-blur-md border border-slate-800/90 rounded-xl p-5 shadow-lg shadow-black/20 ${
        hoverEffect ? 'hover:border-slate-700 transition-all hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
