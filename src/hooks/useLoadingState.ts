import { useState, useCallback } from 'react';

/**
 * Hook to manage loading state for async operations
 * Prevents multiple clicks/touches by tracking loading state
 */
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);

  const execute = useCallback(async (asyncFn: () => Promise<void>) => {
    if (isLoading) return; // Prevent multiple executions
    
    setIsLoading(true);
    try {
      await asyncFn();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  return {
    isLoading,
    execute,
    startLoading,
    stopLoading,
  };
}
