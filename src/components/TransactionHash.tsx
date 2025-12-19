import type { FC } from 'react';
import { dataTestIds } from '../test';

interface TransactionHashProps {
  hash: string;
}

export const TransactionHash: FC<TransactionHashProps> = ({ hash }) => {
  return (
    <>
      <h3>Transaction Hash</h3>
      <pre data-testid={dataTestIds.testPage.sendTRX.transactionHash} className="signedTransactions">
        {hash}
      </pre>
      <a href={`https://tronscan.org/#/transaction/${hash}`} target="_blank" rel="noopener noreferrer">
        View on TronScan
      </a>
    </>
  );
};
