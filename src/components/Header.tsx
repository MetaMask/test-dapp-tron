import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletActionButton } from '@tronweb3/tronwallet-adapter-react-ui';
import { type FC, useCallback } from 'react';
import { TRON_NETWORKS } from '../config';
import { useAdapterVariant } from '../contexts/AdapterVariantContext';
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
  const { variant, setVariant } = useAdapterVariant();

  const handleNetworkChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const network = event.target.value as keyof typeof TRON_NETWORKS;
      switchChain(network);
    },
    [switchChain],
  );

  const handleToggle = useCallback(() => {
    setVariant(variant === 'tronweb3' ? 'metamask' : 'tronweb3');
  }, [variant, setVariant]);

  const isMetaMask = variant === 'metamask';

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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <strong>MetaMask Adapter:</strong>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: isMetaMask ? 400 : 600,
              color: isMetaMask ? '#999' : '#512da8',
              transition: 'color 0.2s',
            }}
          >
            TronAdapter
          </span>
          <button
            data-testid={dataTestIds.testPage.header.metamaskAdapterToggle}
            onClick={handleToggle}
            aria-pressed={isMetaMask}
            type="button"
            aria-label={`MetaMask adapter: currently using ${isMetaMask ? 'MetaMask connect-tron' : 'TronAdapter metamask-tron'}`}
            style={{
              position: 'relative',
              width: '44px',
              height: '24px',
              backgroundColor: isMetaMask ? '#512da8' : '#ccc',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
              transition: 'background-color 0.2s ease',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '2px',
                left: isMetaMask ? '22px' : '2px',
                width: '20px',
                height: '20px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
              }}
            />
          </button>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: isMetaMask ? 600 : 400,
              color: isMetaMask ? '#512da8' : '#999',
              transition: 'color 0.2s',
            }}
          >
            MetaMask
          </span>
        </div>
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
