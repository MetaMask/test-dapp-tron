import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { type FC, useCallback, useState } from 'react';
import { dataTestIds } from '../test';
import { Button } from './Button';

export const SignMessage: FC = () => {
  const { address, signMessage } = useWallet();
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Hello, Tron!');
  const [loading, setLoading] = useState(false);

  /**
   * Handle message change.
   */
  const handleMessageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  /**
   * Handle sign message button click.
   */
  const handleSignMessage = useCallback(async () => {
    if (!address || !signMessage) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    try {
      // For Tron, signMessage expects a string, not Uint8Array
      const signature = await signMessage(message);

      setSignedMessage(signature);
    } finally {
      setLoading(false);
    }
  }, [address, signMessage, message]);

  return (
    <div data-testid={dataTestIds.testPage.signMessage.id}>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="message">Message:</label>
        <input
          data-testid={dataTestIds.testPage.signMessage.message}
          type="text"
          value={message}
          onChange={handleMessageChange}
          style={{ width: '90%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
      </div>
      <Button
        data-testid={dataTestIds.testPage.signMessage.signMessage}
        onClick={handleSignMessage}
        disabled={loading}
        loading={loading}
      >
        Sign Message
      </Button>
      {signedMessage && (
        <>
          <p>Signed Message:</p>
          <pre
            data-testid={dataTestIds.testPage.signMessage.signedMessage}
            style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
            className="signedTransactions"
          >
            {signedMessage}
          </pre>
        </>
      )}
    </div>
  );
};
