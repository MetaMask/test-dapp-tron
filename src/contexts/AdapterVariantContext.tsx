/**
 * Context for selecting which MetaMask adapter implementation is used by TronAdapter's WalletProvider.
 *
 * Two variants are available:
 * - `'tronweb3'` (default): `@tronweb3/tronwallet-adapter-metamask-tron`, the adapter maintained by the TronAdapter ecosystem.
 * - `'metamask'`: `@metamask/connect-tron`, the adapter maintained directly by MetaMask.
 *
 * The selected variant is persisted in localStorage so the choice survives page reloads.
 * Switching variants causes WalletProvider to remount, which disconnects the current wallet session.
 */
import { type FC, type ReactNode, createContext, useCallback, useContext, useState } from 'react';

export type AdapterVariant = 'tronweb3' | 'metamask';

const STORAGE_KEY = 'metamaskAdapterVariant';

type AdapterVariantContextValue = {
  variant: AdapterVariant;
  setVariant: (variant: AdapterVariant) => void;
};

const AdapterVariantContext = createContext<AdapterVariantContextValue | undefined>(undefined);

function getInitialVariant(): AdapterVariant {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'metamask') {
      return 'metamask';
    }
  } catch {
    // ignore
  }
  return 'tronweb3';
}

type AdapterVariantProviderProps = {
  children: ReactNode;
};

export const AdapterVariantProvider: FC<AdapterVariantProviderProps> = ({ children }) => {
  const [variant, setVariantState] = useState<AdapterVariant>(getInitialVariant);

  const setVariant = useCallback((next: AdapterVariant) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    setVariantState(next);
  }, []);

  return <AdapterVariantContext.Provider value={{ variant, setVariant }}>{children}</AdapterVariantContext.Provider>;
};

export function useAdapterVariant(): AdapterVariantContextValue {
  const ctx = useContext(AdapterVariantContext);
  if (!ctx) {
    throw new Error('useAdapterVariant must be used inside AdapterVariantProvider');
  }
  return ctx;
}
