import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import { type FC, useMemo } from 'react';

import '@tronweb3/tronwallet-adapter-react-ui/style.css';
import { TestPage } from './pages/TestPage';

import { MetaMaskAdapter as MetaMaskConnectTronAdapter } from '@metamask/connect-tron';
import { TronLinkAdapter, MetaMaskAdapter as TronWeb3MetaMaskAdapter } from '@tronweb3/tronwallet-adapters';
import { AdapterVariantProvider, useAdapterVariant } from './contexts/AdapterVariantContext';
import { NetworkProvider } from './contexts/NetworkContext';

const AppContent: FC = () => {
  const { variant } = useAdapterVariant();

  const wallets = useMemo(
    () => [
      new TronLinkAdapter(),
      variant === 'metamask' ? new MetaMaskConnectTronAdapter() : new TronWeb3MetaMaskAdapter(),
    ],
    [variant],
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
    <AdapterVariantProvider>
      <AppContent />
    </AdapterVariantProvider>
  );
};
