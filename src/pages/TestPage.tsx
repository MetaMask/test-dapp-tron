import type { FC } from 'react';
import { Header } from '../components/Header';
import { SendTRX } from '../components/SendTRX';
import { SendUSDT } from '../components/SendUSDT';
import { SignMessage } from '../components/SignMessage';
import { Test } from '../components/Test';

export const TestPage: FC = () => {
  return (
    <div style={{ padding: '1rem' }}>
      <div
        style={{
          marginBottom: '2rem',
        }}
      >
        <Header />
      </div>
      <div className="grid">
        <Test key="sendTRX" title="Send TRX">
          <SendTRX />
        </Test>
        <Test key="sendUSDT" title="Send USDT (TRC-20)">
          <SendUSDT />
        </Test>
        <Test key="signMessage" title="Sign Message">
          <SignMessage />
        </Test>
      </div>
    </div>
  );
};
