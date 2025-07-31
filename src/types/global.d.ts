// 全局类型声明文件

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      isSolflare?: boolean;
      isBackpack?: boolean;
      isCoinbaseWallet?: boolean;
      [key: string]: any;
    };
    ethereum?: {
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      [key: string]: any;
    };
  }
}

export {};
