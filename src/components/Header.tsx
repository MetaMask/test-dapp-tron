import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletActionButton } from '@tronweb3/tronwallet-adapter-react-ui';
import { type FC, useCallback } from 'react';
import { TRON_NETWORKS } from '../config';
import { useNetwork } from '../contexts/NetworkContext';
import { dataTestIds } from '../test';
import { Account } from './Account';

type HeaderProps = {};

/**
 * Header component
 */
export const Header: FC<HeaderProps> = () => {
  const { address, connected } = useWallet();
  const { selectedNetwork, switchChain } = useNetwork();

  const handleNetworkChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const network = event.target.value as keyof typeof TRON_NETWORKS;
      switchChain(network);
    },
    [switchChain],
  );

  return (
    <div
      data-testid={dataTestIds.testPage.header.id}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem',
        alignItems: 'start',
      }}
    >
      <div style={{ wordWrap: 'break-word' }}>
        <strong>Network:</strong>
        <select
          data-testid={dataTestIds.testPage.header.endpoint}
          value={selectedNetwork}
          onChange={handleNetworkChange}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginTop: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          {Object.entries(TRON_NETWORKS).map(([key, network]) => (
            <option key={key} value={key}>
              {network.name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ wordWrap: 'break-word' }}>
        <strong>Status:</strong>
        <div data-testid={dataTestIds.testPage.header.connectionStatus}>
          {connected ? 'Connected' : 'Not connected'}
        </div>
      </div>
      <div style={{ wordWrap: 'break-word' }}>
        <strong>Wallet:</strong>
        <div data-testid={dataTestIds.testPage.header.account}>{address ? <Account account={address} /> : 'N/A'}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <WalletActionButton
          data-testid={connected ? dataTestIds.testPage.header.disconnect : dataTestIds.testPage.header.connect}
          style={{
            backgroundColor: '#512da8',
            borderColor: '#512da8',
            color: 'white',
          }}
        />
      </div>
    </div>
  );
};
