import { useState } from 'react';

interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export const useLoading = (initialState: boolean = false) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: initialState
  });

  const setLoading = (loading: boolean, message?: string) => {
    setLoadingState({
      isLoading: loading,
      message
    });
  };

  const startLoading = (message?: string) => {
    setLoading(true, message);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  return {
    ...loadingState,
    setLoading,
    startLoading,
    stopLoading
  };
};

export const useApi = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const apiRequest = async <T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    startLoading();
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      throw err;
    } finally {
      stopLoading();
    }
  };

  return {
    apiRequest,
    isLoading,
    error,
    setError
  };
};
