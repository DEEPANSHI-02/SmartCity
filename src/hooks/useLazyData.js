import { useState, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

export const useLazyData = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { targetRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (!hasIntersected) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [hasIntersected, ...dependencies]);

  return { targetRef, data, loading, error, hasIntersected };
};