import React, { forwardRef } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', variant = 'default' }, ref) => {
    const variants = {
      default: 'bg-white shadow-lg',
      elevated: 'bg-white shadow-xl',
      outlined: 'bg-white border-2 border-gray-200',
    };

    return (
      <div
        ref={ref}
        className={`rounded-2xl p-6 transition-all duration-300 ${variants[variant]} ${className}`}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
