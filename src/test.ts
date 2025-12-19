type Pathify<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends true
    ? `${Prefix extends '' ? '' : `${Prefix}.`}${Extract<K, string>}`
    : T[K] extends object
      ? Pathify<T[K], `${Prefix extends '' ? '' : `${Prefix}.`}${Extract<K, string>}`>
      : never;
};

function pathifyObject<T>(obj: T): Pathify<T> {
  function inner(obj: any, path = ''): any {
    const result: any = {};
    for (const key in obj) {
      const fullPath = (path ? `${path}.${key}` : key).toLowerCase();
      if (obj[key] === true) {
        result[key] = fullPath;
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = inner(obj[key], fullPath);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }

  return inner(obj) as Pathify<T>;
}

/**
 * The list of test ids to access elements in the e2e2 tests.
 */
export const dataTestIds = pathifyObject({
  testPage: {
    header: {
      id: true,
      endpoint: true,
      updateEndpoint: true,
      connect: true,
      disconnect: true,
      account: true,
      connectionStatus: true,
    },
    signMessage: {
      id: true,
      message: true,
      signMessage: true,
      signedMessage: true,
    },
    sendUSDT: {
      id: true,
      address: true,
      signTransaction: true,
      sendTransaction: true,
      signedTransaction: true,
      transactionHash: true,
      amount: true,
    },
    sendTRX: {
      id: true,
      address: true,
      signTransaction: true,
      sendTransaction: true,
      signedTransaction: true,
      transactionHash: true,
      amount: true,
    },
  },
} as const);
