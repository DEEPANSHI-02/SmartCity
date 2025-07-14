import { useState, useEffect, useRef } from 'react';
import { useNetworkInfo } from './useNetworkInfo';

export const useAdaptiveData = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const { networkInfo, adaptiveSettings } = useNetworkInfo();
  const intervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  const fetchData = async (force = false) => {
    // Don't fetch if offline
    if (!networkInfo.isOnline && !force) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction({
        quality: adaptiveSettings.imageQuality,
        mode: adaptiveSettings.dataMode,
        signal: abortControllerRef.current.signal
      });
      
      setData(result);
      setLastUpdate(new Date());
      console.log(`📡 Data fetched with ${adaptiveSettings.dataMode} mode`);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error(' Data fetch failed:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up adaptive refresh interval
    if (adaptiveSettings.refreshInterval > 0 && networkInfo.isOnline) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, adaptiveSettings.refreshInterval);

      console.log(`⏱️ Refresh interval set to ${adaptiveSettings.refreshInterval}ms`);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [adaptiveSettings.refreshInterval, networkInfo.isOnline, ...dependencies]);

  const refreshData = () => fetchData(true);

  return {
    data,
    loading,
    error,
    lastUpdate,
    refreshData,
    adaptiveSettings,
    networkInfo
  };
};