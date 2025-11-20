import type { FC } from 'react';
import { TronShort } from './TronShort';

interface AccountProps {
  account: string;
}

/**
 * Get the TronScan URL for an account
 */
const getTronScanAccountUrl = (address: string): string | undefined => {
  return `https://tronscan.org/#/address/${address}`;
};

/**
 * Account component
 */
export const Account: FC<AccountProps> = ({ account, ...props }) => {
  return <TronShort {...props} content={account} tronScanUrl={getTronScanAccountUrl(account)} />;
};
