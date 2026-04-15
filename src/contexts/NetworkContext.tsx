import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { TRON_NETWORKS, getDefaultNetworkKey } from '../config';

type NetworkKey = keyof typeof TRON_NETWORKS;

// ---------------------------------------------------------------------------
// NetworkSelectionContext — the user's explicit network choice.
// Lives ABOVE WalletProvider (no useWallet). Drives WalletProvider key and
// WalletConnectAdapter network. Updated ONLY by direct user action (Header
// dropdown). Never written by chainChanged, to avoid feedback loops.
// ---------------------------------------------------------------------------

interface NetworkSelectionContextValue {
  selectedNetwork: NetworkKey;
  setSelectedNetwork: (network: NetworkKey) => void;
}

const NetworkSelectionContext = createContext<NetworkSelectionContextValue | undefined>(undefined);

export function useNetworkSelection(): NetworkSelectionContextValue {
  const ctx = useContext(NetworkSelectionContext);
  if (!ctx) {
    throw new Error('useNetworkSelection must be used within a NetworkSelectionProvider');
  }
  return ctx;
}

function getInitialNetwork(): NetworkKey {
  try {
    const saved = localStorage.getItem('selectedNetwork');
    if (saved && saved in TRON_NETWORKS) {
      return saved as NetworkKey;
    }
  } catch (error) {
    console.warn('Failed to read network from localStorage:', error);
  }
  return getDefaultNetworkKey();
}

export const NetworkSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedNetwork, setSelectedNetworkState] = useState<NetworkKey>(getInitialNetwork);

  const setSelectedNetwork = useCallback((network: NetworkKey) => {
    try {
      localStorage.setItem('selectedNetwork', network);
    } catch (error) {
      console.warn('Failed to save network to localStorage:', error);
    }
    setSelectedNetworkState(network);
  }, []);

  return (
    <NetworkSelectionContext.Provider value={{ selectedNetwork, setSelectedNetwork }}>
      {children}
    </NetworkSelectionContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// NetworkContext — exposes the active network + switchChain to components.
// Lives INSIDE WalletProvider. Uses its own local state for activeNetwork so
// that chainChanged events never propagate back to NetworkSelectionContext.
// ---------------------------------------------------------------------------

interface NetworkContextType {
  selectedNetwork: NetworkKey;
  switchChain: (network: NetworkKey) => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const { wallet, connected } = useWallet();
  const { selectedNetwork: requestedNetwork } = useNetworkSelection();

  // Local state: reflects what the adapter currently reports via chainChanged.
  // Intentionally NOT written back to NetworkSelectionContext to avoid loops.
  const [activeNetwork, setActiveNetwork] = useState<NetworkKey>(requestedNetwork);

  const switchChain = useCallback(
    async (network: NetworkKey) => {
      if (!wallet || !connected) {
        console.warn('Wallet not connected, cannot switch chain');
        return;
      }
      try {
        await wallet.adapter.switchChain(TRON_NETWORKS[network].chainId);
      } catch (error) {
        console.error('Failed to switch chain:', error);
      }
    },
    [wallet, connected],
  );

  // Auto-switch when wallet connects or when the user picks a new network.
  useEffect(() => {
    if (connected && wallet) {
      switchChain(requestedNetwork);
    }
  }, [connected, wallet, requestedNetwork, switchChain]);

  // Keep activeNetwork in sync with chainChanged events (local only).
  useEffect(() => {
    if (!wallet) return;

    const handleChainChanged = (chainData: unknown) => {
      console.log('Chain changed detected in NetworkProvider:', chainData);
      const chainId = (chainData as { chainId: string }).chainId;
      const networkKey = Object.keys(TRON_NETWORKS).find(
        (key) => TRON_NETWORKS[key as NetworkKey].chainId === chainId,
      ) as NetworkKey | undefined;
      if (networkKey) {
        setActiveNetwork(networkKey);
      }
    };

    wallet.adapter.on('chainChanged', handleChainChanged);
    return () => {
      wallet.adapter.off('chainChanged', handleChainChanged);
    };
  }, [wallet]);

  return (
    <NetworkContext.Provider value={{ selectedNetwork: activeNetwork, switchChain }}>
      {children}
    </NetworkContext.Provider>
  );
};
