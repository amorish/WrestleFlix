import { useState, useEffect, useCallback } from 'react';

export function useUrlState<T extends string | null>(key: string, initialValue: T): [T, (val: T) => void] {
  const [state, setState] = useState<T>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlValue = searchParams.get(key);
    return (urlValue !== null ? urlValue : initialValue) as T;
  });

  const setUrlState = useCallback((newValue: T) => {
    setState(newValue);
    
    const searchParams = new URLSearchParams(window.location.search);
    if (newValue === initialValue || newValue === '' || newValue === null) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, newValue as string);
    }
    
    const newSearch = searchParams.toString();
    const newRelativePathQuery = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
    window.history.pushState(null, '', newRelativePathQuery);
    
    window.dispatchEvent(new Event('urlstatechange'));
  }, [key, initialValue]);

  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const urlValue = searchParams.get(key);
      setState((urlValue !== null ? urlValue : initialValue) as T);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('urlstatechange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('urlstatechange', handlePopState);
    };
  }, [key, initialValue]);

  return [state, setUrlState];
}
