import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useEffect, useState } from 'react';

type ReadyAdapter = ReturnType<typeof useWallet>['wallets'][number]['adapter'];

type WalletEntry = {
  adapter: ReadyAdapter;
};

function isMetaMaskName(name: string): boolean {
  return name.includes('MetaMask');
}

export function findMetaMaskAdapter(wallets: readonly WalletEntry[]): ReadyAdapter | undefined {
  return wallets.find(({ adapter }) => isMetaMaskName(adapter.name))?.adapter;
}

export function useMetaMaskReady(): boolean {
  const { wallets } = useWallet();
  const adapter = findMetaMaskAdapter(wallets);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    if (!adapter) {
      return;
    }

    const updateReadyState = () => setReady(String(adapter.readyState) === 'Found');
    updateReadyState();
    adapter.on('readyStateChanged', updateReadyState);

    return () => {
      adapter.off('readyStateChanged', updateReadyState);
    };
  }, [adapter]);

  return ready;
}
