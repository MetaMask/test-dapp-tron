import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { TRON_NETWORKS, getDefaultNetworkKey } from '../config';

type NetworkKey = keyof typeof TRON_NETWORKS;

interface NetworkContextType {
  selectedNetwork: NetworkKey;
  // setSelectedNetwork: (network: NetworkKey) => void;
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

  // Initialize selectedNetwork from localStorage or default
  const getInitialNetwork = (): NetworkKey => {
    try {
      const saved = localStorage.getItem('selectedNetwork');
      if (saved && saved in TRON_NETWORKS) {
        return saved as NetworkKey;
      }
    } catch (error) {
      console.warn('Failed to read network from localStorage:', error);
    }
    return getDefaultNetworkKey();
  };

  const [selectedNetwork, setSelectedNetwork] = useState<NetworkKey>(getInitialNetwork);

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

  // Save selectedNetwork to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('selectedNetwork', selectedNetwork);
    } catch (error) {
      console.warn('Failed to save network to localStorage:', error);
    }
  }, [selectedNetwork]);

  useEffect(() => {
    if (connected && wallet) {
      // Auto-switch to selected network when wallet connects
      switchChain(selectedNetwork);
    }
  }, [connected, wallet, selectedNetwork, switchChain]);

  useEffect(() => {
    if (!wallet) {
      return;
    }

    const handleChainChanged = (chainData: unknown) => {
      console.log('Chain changed detected in NetworkProvider:', chainData);
      // chainData is an object like {chainId: '0x2b6653dc'}
      const chainId = (chainData as { chainId: string }).chainId;
      const networkKey = Object.keys(TRON_NETWORKS).find(
        (key) => TRON_NETWORKS[key as NetworkKey].chainId === chainId,
      ) as NetworkKey | undefined;
      if (networkKey) {
        setSelectedNetwork(networkKey);
      }
    };

    wallet.adapter.on('chainChanged', handleChainChanged);

    return () => {
      wallet.adapter.off('chainChanged', handleChainChanged);
    };
  }, [wallet]);

  return <NetworkContext.Provider value={{ selectedNetwork, switchChain }}>{children}</NetworkContext.Provider>;
};
