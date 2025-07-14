import { useState, useEffect, useRef } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
    ...options
  };

  useEffect(() => {
    const target = targetRef.current;
    
    if (!target || !window.IntersectionObserver) {
      // Fallback for browsers without Intersection Observer
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          setIsIntersecting(isVisible);
          
          if (isVisible && !hasIntersected) {
            setHasIntersected(true);
            
            // If triggerOnce is true, disconnect after first intersection
            if (defaultOptions.triggerOnce) {
              observer.unobserve(target);
            }
          }
        });
      },
      defaultOptions
    );

    observer.observe(target);

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasIntersected, defaultOptions.triggerOnce]);

  return { 
    targetRef, 
    isIntersecting, 
    hasIntersected,
    isSupported: !!window.IntersectionObserver 
  };
};