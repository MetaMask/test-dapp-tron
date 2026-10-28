import { act, renderHook } from '@testing-library/react';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMetaMaskReady } from './useMetaMaskReady';

vi.mock('@tronweb3/tronwallet-adapter-react-hooks');

const useWalletMock = vi.mocked(useWallet);

const createAdapter = (name: string, readyState: string) => {
  let emitReadyStateChanged: (() => void) | undefined;
  const adapter = {
    name,
    readyState,
    on: (event: string, listener: () => void) => {
      if (event === 'readyStateChanged') {
        emitReadyStateChanged = listener;
      }
    },
    off: vi.fn(),
  };

  return {
    adapter,
    emitReadyStateChanged: () => emitReadyStateChanged?.(),
  };
};

type Wallets = { adapter: ReturnType<typeof createAdapter>['adapter'] }[];

function mockWallets(wallets: Wallets): void {
  useWalletMock.mockReturnValue({ wallets } as unknown as ReturnType<typeof useWallet>);
}

describe('useMetaMaskReady', () => {
  beforeEach(() => {
    mockWallets([]);
  });

  it('is not ready when no wallet is available', () => {
    const { result } = renderHook(() => useMetaMaskReady());

    expect(result.current).toBe(false);
  });

  it('follows the MetaMask adapter ready state', () => {
    const { adapter, emitReadyStateChanged } = createAdapter('MetaMask', 'Loading');
    mockWallets([{ adapter }]);

    const { result } = renderHook(() => useMetaMaskReady());
    expect(result.current).toBe(false);

    adapter.readyState = 'Found';
    act(() => emitReadyStateChanged());
    expect(result.current).toBe(true);

    adapter.readyState = 'NotFound';
    act(() => emitReadyStateChanged());
    expect(result.current).toBe(false);
  });

  it('returns to not-ready when MetaMask is no longer available', () => {
    const { adapter } = createAdapter('MetaMask', 'Found');
    mockWallets([{ adapter }]);

    const { result, rerender } = renderHook(() => useMetaMaskReady());
    expect(result.current).toBe(true);

    mockWallets([]);
    rerender();
    expect(result.current).toBe(false);
  });
});
