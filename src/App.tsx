import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import { type FC, useMemo } from 'react';

import '@tronweb3/tronwallet-adapter-react-ui/style.css';
import { TestPage } from './pages/TestPage';

import { MetaMaskAdapter as MetaMaskConnectTronAdapter } from '@metamask/connect-tron';
import { WalletConnectAdapter } from '@tronweb3/tronwallet-adapter-walletconnect';
import { TronLinkAdapter, MetaMaskAdapter as TronWeb3MetaMaskAdapter } from '@tronweb3/tronwallet-adapters';
import { getWCNetworkName } from './config';
import { AdapterVariantProvider, useAdapterVariant } from './contexts/AdapterVariantContext';
import { NetworkProvider, NetworkSelectionProvider, useNetworkSelection } from './contexts/NetworkContext';

const AppContent: FC = () => {
  const { variant } = useAdapterVariant();
  const { selectedNetwork } = useNetworkSelection();

  const wallets = useMemo(
    () => [
      new TronLinkAdapter(),
      variant === 'metamask' ? new MetaMaskConnectTronAdapter() : new TronWeb3MetaMaskAdapter(),
      new WalletConnectAdapter({
        network: getWCNetworkName[selectedNetwork],
        options: {
          projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? '',
          metadata: {
            name: 'MetaMask Tron Test DApp',
            description: 'Test DApp for Tron',
            url: window.location.origin,
            icons: [],
          },
        },
      }),
    ],
    [variant, selectedNetwork],
  );

  return (
    <WalletProvider key={variant} adapters={wallets} autoConnect={true}>
      <WalletModalProvider>
        <NetworkProvider>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              height: '100vh',
              width: '100vw',
              padding: '1rem',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '1600px',
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              <TestPage />
            </div>
          </div>
        </NetworkProvider>
      </WalletModalProvider>
    </WalletProvider>
  );
};

export const App: FC = () => {
  return (
    <NetworkSelectionProvider>
      <AdapterVariantProvider>
        <AppContent />
      </AdapterVariantProvider>
    </NetworkSelectionProvider>
  );
};
