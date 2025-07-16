import { ethers } from 'ethers';
import { contractConfig, SEPOLIA_CHAIN_ID, LOCAL_RPC_URL } from '../../lib/contractConfig';

export const sepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || contractConfig.rpcUrl || "https://sepolia.infura.io/v3/09c832bba61c4ccda04fcb3082cc0cdb");

// Create contract instance
export const getTesseractContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  return new ethers.Contract(contractConfig.address, contractConfig.abi, signerOrProvider);
};

// Connect to MetaMask
export const connectWallet = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create Web3Provider with MetaMask
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      
      return { provider: web3Provider, signer, address };
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    }
  } else {
    throw new Error('MetaMask is not installed');
  }
};

// Check if wallet is connected
export const checkWalletConnection = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        return { provider: web3Provider, signer, address };
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  }
  return null;
};

// Switch to Sepolia network
export const switchToSepoliaNetwork = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const SEPOLIA_HEX_CHAIN_ID = ethers.utils.hexlify(SEPOLIA_CHAIN_ID);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_HEX_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_HEX_CHAIN_ID,
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'], // A public RPC endpoint
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          throw new Error('Failed to add Sepolia network to MetaMask.');
        }
      } else {
        console.error('Error switching to Sepolia network:', switchError);
        throw new Error('Failed to switch to Sepolia network.');
      }
    }
  }
};

// Types for better TypeScript support
export interface Agent {
  id: string;
  name: string;
  bio: string;
  imageURI: string;
  contact: string;
  owner: string;
}

export interface Service {
  description: string;
  outputURI: string;
  inputSpecsURI: string;
  outputSpecsURI: string;
  price: string;
  completedServices: string;
  failedServices: string;
  totReviews: string;
  reputation: string;
  agentId: string;
}

// Declare ethereum on window for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
} 