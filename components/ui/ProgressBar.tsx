import React, { useEffect, useRef } from 'react';
import { animateProgressBar } from '@/lib/animations';

interface ProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  variant?: 'primary' | 'success' | 'danger';
  className?: string;
}

export default function ProgressBar({
  progress,
  showLabel = true,
  variant = 'primary',
  className = '',
}: ProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  const variants = {
    primary: 'bg-primary-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
  };

  useEffect(() => {
    if (progressRef.current) {
      animateProgressBar(progressRef.current, progress);
    }
  }, [progress]);

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-gray-900">
            {clampedProgress}%
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          ref={progressRef}
          className={`h-full rounded-full transition-all duration-500 ${variants[variant]}`}
          style={{ width: '0%' }}
        />
      </div>
    </div>
  );
}
