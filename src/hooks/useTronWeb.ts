import { useMemo } from 'react';
import { TronWeb } from 'tronweb';
import { getTronWebConfig } from '../config';
import { useNetwork } from '../contexts/NetworkContext';

// Hook to create TronWeb instance based on selected network
export const useTronWeb = () => {
  const { selectedNetwork } = useNetwork();

  return useMemo(() => {
    const tronWebConfig = getTronWebConfig(selectedNetwork);
    return new TronWeb({
      fullHost: tronWebConfig.fullHost,
      headers: tronWebConfig.headers,
    });
  }, [selectedNetwork]);
};
