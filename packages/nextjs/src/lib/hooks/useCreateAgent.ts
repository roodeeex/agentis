import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';

interface CreateAgentData {
  name: string;
  bio: string;
  imageURI: string;
  contact: string;
}

interface CreateAgentState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  transactionHash: string | null;
}

export const useCreateAgent = () => {
  const { getContract, isConnected } = useWeb3();
  const [state, setState] = useState<CreateAgentState>({
    isLoading: false,
    isSuccess: false,
    error: null,
    transactionHash: null,
  });

  const createAgent = useCallback(async (agentData: CreateAgentData) => {
    if (!isConnected) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    try {
      setState({
        isLoading: true,
        isSuccess: false,
        error: null,
        transactionHash: null,
      });

      const contract = getContract();
      
      // Call createAgent function
      const tx = await contract.createAgent(
        agentData.name,
        agentData.bio,
        agentData.imageURI,
        agentData.contact
      );

      setState(prev => ({
        ...prev,
        transactionHash: tx.hash,
      }));

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
        }));

        // Extract agent ID from events
        const agentCreatedEvent = receipt.events?.find(
          (event: any) => event.event === 'AgentCreated'
        );
        
        if (agentCreatedEvent) {
          const agentId = agentCreatedEvent.args?.agentId.toString();
          console.log('Agent created with ID:', agentId);
          return { agentId, transactionHash: tx.hash };
        }

        return { transactionHash: tx.hash };
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err: any) {
      console.error('Error creating agent:', err);
      
      let errorMessage = 'Failed to create agent';
      
      if (err.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction rejected by user';
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for transaction';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      throw err;
    }
  }, [getContract, isConnected]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isSuccess: false,
      error: null,
      transactionHash: null,
    });
  }, []);

  return {
    createAgent,
    reset,
    ...state,
  };
}; 