import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export const LazyWrapper = ({ 
  children, 
  fallback = null, 
  className = "",
  threshold = 0.1,
  rootMargin = "50px",
  animationDelay = 0
}) => {
  const { targetRef, hasIntersected, isSupported } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  // If Intersection Observer is not supported, render immediately
  if (!isSupported) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      ref={targetRef} 
      className={`${className} transition-all duration-700 ease-out ${
        hasIntersected 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        transitionDelay: hasIntersected ? `${animationDelay}ms` : '0ms' 
      }}
    >
      {hasIntersected ? children : (fallback || <div className="h-32 bg-gray-800/20 rounded-xl animate-pulse" />)}
    </div>
  );
};