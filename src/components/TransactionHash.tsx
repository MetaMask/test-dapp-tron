import type { FC } from 'react';

interface TransactionHashProps {
  hash: string;
}

export const TransactionHash: FC<TransactionHashProps> = ({ hash }) => {
  return (
    <>
      <h3>Transaction Hash</h3>
      <pre className="signedTransactions">{hash}</pre>
      <a href={`https://tronscan.org/#/transaction/${hash}`} target="_blank" rel="noopener noreferrer">
        View on TronScan
      </a>
    </>
  );
};
