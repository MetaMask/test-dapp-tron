import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { type ChangeEvent, type FC, useCallback, useState } from 'react';
import { DEFAULT_RECIPIENT, TRON_NETWORKS } from '../config';
import { useNetwork } from '../contexts/NetworkContext';
import { useTronWeb } from '../hooks/useTronWeb';
import { dataTestIds } from '../test';
import { Button } from './Button';
import { TransactionHash } from './TransactionHash';

export const SendTRX: FC = () => {
  const { address, signTransaction } = useWallet();
  const { selectedNetwork } = useNetwork();
  const tronWeb = useTronWeb();
  const [signedTransaction, setSignedTransaction] = useState<any | undefined>();
  const [transactionHash, setTransactionHash] = useState<string | undefined>();
  const [toAddress, setToAddress] = useState<string>(DEFAULT_RECIPIENT);
  const [amount, setAmount] = useState<string>('1');
  const [loading, setLoading] = useState(false);

  /**
   * Handle address change.
   */
  const handleAddressChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setToAddress(event.target.value);
  }, []);

  /**
   * Handle amount change.
   */
  const handleAmountChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  }, []);

  /**
   * Create a TRX transfer transaction.
   */
  const createTransaction = useCallback(async () => {
    if (!address) {
      throw new Error('Wallet address not available');
    }

    // Create TRX transfer transaction using TronWeb
    const amountInSun = Math.floor(Number.parseFloat(amount) * 1_000_000); // Convert to SUN
    return await tronWeb.transactionBuilder.sendTrx(toAddress, amountInSun, address, {});
  }, [address, toAddress, amount, tronWeb]);

  /**
   * Sign the transaction using wallet adapter.
   */
  const signOnly = useCallback(async () => {
    if (!signTransaction || !address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    try {
      const transaction = await createTransaction();

      // Use wallet's signTransaction method
      const signedTx = await signTransaction(transaction);
      setSignedTransaction(signedTx);
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [signTransaction, address, createTransaction]);

  /**
   * Sign and send the transaction using wallet adapter.
   */
  const signAndSend = useCallback(async () => {
    if (!signTransaction || !address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    try {
      const transaction = await createTransaction();

      // Sign transaction with wallet
      const signedTx = await signTransaction(transaction);

      // Broadcast the transaction
      const broadcastResult = await tronWeb.trx.sendRawTransaction(signedTx);

      if (broadcastResult.result) {
        setTransactionHash(broadcastResult.txid || broadcastResult.transaction?.txID);
      } else {
        throw new Error('Failed to broadcast transaction');
      }

      setSignedTransaction(signedTx);
    } catch (error) {
      console.error('Error signing/sending transaction:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [signTransaction, address, createTransaction, tronWeb]);

  return (
    <div data-testid={dataTestIds.testPage.sendTRX.id}>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="address">Destination Address:</label>
        <input
          data-testid={dataTestIds.testPage.sendTRX.address}
          type="text"
          value={toAddress}
          onChange={handleAddressChange}
          style={{ width: '90%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="amount">Amount (TRX):</label>
        <input
          data-testid={dataTestIds.testPage.sendTRX.amount}
          type="number"
          value={amount}
          onChange={handleAmountChange}
          min="0"
          step="0.000001"
          style={{ width: '90%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
        <strong>Mode:</strong> TRX Transfer
        <br />
        <strong>Network:</strong> {TRON_NETWORKS[selectedNetwork].name}
        <br />
        <strong>Amount Unit:</strong> TRX
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button
          data-testid={dataTestIds.testPage.sendTRX.signTransaction}
          onClick={signOnly}
          disabled={!address}
          loading={loading}
        >
          Sign Transaction
        </Button>
        <Button
          data-testid={dataTestIds.testPage.sendTRX.sendTransaction}
          onClick={signAndSend}
          disabled={!address}
          loading={loading}
        >
          Sign and Send Transaction
        </Button>
      </div>

      {signedTransaction && (
        <>
          <h3>Signed transaction</h3>
          <pre data-testid={dataTestIds.testPage.sendTRX.signedTransaction} className="signedTransactions">
            {JSON.stringify(signedTransaction, null, 2)}
          </pre>
        </>
      )}

      {transactionHash && (
        <>
          <h3>Transaction</h3>
          <TransactionHash data-testid={dataTestIds.testPage.sendTRX.transactionHash} hash={transactionHash} />
        </>
      )}
    </div>
  );
};
