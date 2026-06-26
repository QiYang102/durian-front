import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import GlobalLoading from './GlobalLoading';

interface GlobalLoadingContextType {
  showLoading: (text?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType>({
  showLoading: () => {},
  hideLoading: () => {},
  isLoading: false,
});

export const useGlobalLoading = () => useContext(GlobalLoadingContext);

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | undefined>();
  const counterRef = useRef(0);

  const showLoading = useCallback((text?: string) => {
    counterRef.current += 1;
    setLoadingText(text);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    counterRef.current = Math.max(0, counterRef.current - 1);
    if (counterRef.current === 0) {
      setIsLoading(false);
      setLoadingText(undefined);
    }
  }, []);

  return (
    <GlobalLoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      <GlobalLoading isOpen={isLoading} text={loadingText} />
    </GlobalLoadingContext.Provider>
  );
}
