import { useState, useEffect } from 'react';

export function usePro() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem('com.famcal.pro.enabled') === 'true';
    if (status) {
      setTimeout(() => setIsPro(true), 0);
    }
  }, []);

  const enablePro = () => {
    localStorage.setItem('com.famcal.pro.enabled', 'true');
    setIsPro(true);
  };

  const disablePro = () => {
    localStorage.removeItem('com.famcal.pro.enabled');
    setIsPro(false);
  };

  return { isPro, enablePro, disablePro };
}
