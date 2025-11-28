import React from 'react';

interface CTAButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function CTAButton({ 
  children, 
  href, 
  onClick, 
  type = 'button',
  size = 'lg', 
  className = '',
  fullWidth = false,
  disabled = false
}: CTAButtonProps) {
  const baseClasses = 'inline-block font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-white';
  
  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-8 py-4 text-xl'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const gradientClasses = disabled 
    ? 'bg-gray-400 cursor-not-allowed' 
    : className.includes('bg-gray-') 
      ? '' // Use custom background from className
      : 'bg-gradient-to-r from-[#3b7d98] to-[#3b7d98e0] hover:from-[#2d5f75] hover:to-[#2d5f75e0]';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : '';
  const classes = `${baseClasses} ${gradientClasses} ${sizeClasses[size]} ${widthClass} ${disabledClasses} ${className}`;
  
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
