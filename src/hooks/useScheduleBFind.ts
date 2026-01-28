import { useState, useCallback, useEffect } from 'react';
import { findScheduleB } from '../api/classifyApi';
import type { ScheduleBResponse } from '../types/census';

interface UseScheduleBFindReturn {
  loading: boolean;
  error: string | null;
  scheduleData: ScheduleBResponse | null;
  refetch: (code: string) => Promise<void>;
}

/**
 * Hook to fetch and manage Schedule B hierarchy data
 */
export function useScheduleBFind(hsCode: string | null): UseScheduleBFindReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleBResponse | null>(null);

  const fetchScheduleB = useCallback(async (code: string) => {
    if (!code) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = await findScheduleB(code);
      setScheduleData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setScheduleData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when hsCode changes
  useEffect(() => {
    if (hsCode) {
      fetchScheduleB(hsCode);
    }
  }, [hsCode, fetchScheduleB]);

  return {
    loading,
    error,
    scheduleData,
    refetch: fetchScheduleB,
  };
}
