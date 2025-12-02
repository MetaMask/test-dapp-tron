import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import { type FC, useMemo } from 'react';

import '@tronweb3/tronwallet-adapter-react-ui/style.css';
import { TestPage } from './pages/TestPage';

import { MetaMaskAdapter } from '@metamask/connect-tron';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapters';
import { NetworkProvider } from './contexts/NetworkContext';

const AppContent: FC = () => {
  const wallets = useMemo(() => [new TronLinkAdapter(), new MetaMaskAdapter()], []);

  return (
    <WalletProvider adapters={wallets} autoConnect={true}>
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
  return <AppContent />;
};
