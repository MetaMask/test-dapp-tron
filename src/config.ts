/**
 * The default contract address for USDT (TRC-20) on Tron.
 */
export const USDT_CONTRACT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

/**
 * TRON PRO API Key from environment variables.
 * Leave empty to use public API (rate limited).
 */
export const TRON_PRO_API_KEY = process.env.VITE_TRON_PRO_API_KEY || '';

/**
 * Contract addresses by network.
 */
export const CONTRACT_ADDRESSES = {
  mainnet: {
    USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // Mainnet USDT
  },
  shasta: {
    USDT: 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs', // Shasta testnet USDT-like token
  },
  nile: {
    USDT: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj', // Nile testnet USDT
  },
} as const;

/**
 * The default Tron network configurations.
 */
export const TRON_NETWORKS = {
  mainnet: {
    fullHost: 'https://api.trongrid.io',
    name: 'Mainnet',
    chainId: '0x2b6653dc',
  },
  shasta: {
    fullHost: 'https://api.shasta.trongrid.io',
    name: 'Shasta Testnet',
    chainId: '0x94a9059e',
  },
  nile: {
    fullHost: 'https://nile.trongrid.io',
    name: 'Nile Testnet',
    chainId: '0xcd8690dc',
  },
} as const;

/**
 * Mapping of our network keys to WalletConnect's expected network names.
 */
export type NetworkKey = keyof typeof TRON_NETWORKS;

/**
 * Get the default network key.
 */
export const getDefaultNetworkKey = (): NetworkKey => {
  // Find the key of DEFAULT_NETWORK
  return (
    (Object.keys(TRON_NETWORKS) as NetworkKey[]).find((key) => TRON_NETWORKS[key] === DEFAULT_NETWORK) || 'mainnet'
  );
};

/**
 * Get TronWeb configuration for a specific network.
 */
export const getTronWebConfig = (network: NetworkKey = getDefaultNetworkKey()) => {
  const networkConfig = TRON_NETWORKS[network];
  const config: any = {
    fullHost: networkConfig.fullHost,
  };

  // Only add API key headers if key is provided
  if (TRON_PRO_API_KEY) {
    config.headers = { 'Content-Type': 'application/json', 'TRON-PRO-API-KEY': TRON_PRO_API_KEY };
  }

  return config;
};

/**
 * WalletConnect expects specific network names. This mapping translates our internal network keys to those expected by WalletConnect.
 */
export const getWCNetworkName: Record<NetworkKey, 'Mainnet' | 'Shasta' | 'Nile'> = {
  mainnet: 'Mainnet',
  shasta: 'Shasta',
  nile: 'Nile',
};

/**
 * Get contract address for a specific network and contract type.
 */
export const getContractAddress = (
  contract: keyof typeof CONTRACT_ADDRESSES.mainnet,
  network: NetworkKey = getDefaultNetworkKey(),
) => {
  return CONTRACT_ADDRESSES[network][contract];
};

/**
 * The default network to use in the tests.
 */
export const DEFAULT_NETWORK = TRON_NETWORKS.shasta;

/**
 * Default recipient address for testing transactions.
 * Can be overridden with VITE_DEFAULT_RECIPIENT environment variable.
 */
export const DEFAULT_RECIPIENT = process.env.VITE_DEFAULT_RECIPIENT || 'TEcjynxEx7bPfDByW1uwPgsLCBhqynvpQx'; // Known mainnet address
