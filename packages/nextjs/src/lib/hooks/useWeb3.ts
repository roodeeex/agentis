import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { connectWallet, checkWalletConnection, switchToSepoliaNetwork, getTesseractContract } from '../web3';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  isLoading: boolean;
  error: string | null;
}

export const useWeb3 = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    provider: null,
    signer: null,
    isLoading: false,
    error: null,
  });

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connection = await checkWalletConnection();
        if (connection) {
          setWalletState({
            isConnected: true,
            address: connection.address,
            provider: connection.provider,
            signer: connection.signer,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();
  }, []);

  // Connect wallet function
  const connect = useCallback(async () => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // First switch to Sepolia network
      await switchToSepoliaNetwork();
      
      // Then connect wallet
      const connection = await connectWallet();
      
      setWalletState({
        isConnected: true,
        address: connection.address,
        provider: connection.provider,
        signer: connection.signer,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  }, []);

  // Disconnect wallet function
  const disconnect = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      provider: null,
      signer: null,
      isLoading: false,
      error: null,
    });
  }, []);

  // Get contract instance
  const getContract = useCallback(() => {
    if (!walletState.signer) {
      throw new Error('Wallet not connected');
    }
    return getTesseractContract(walletState.signer);
  }, [walletState.signer]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          // Reconnect with new account
          connect();
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [connect, disconnect]);

  return {
    ...walletState,
    connect,
    disconnect,
    getContract,
  };
}; 