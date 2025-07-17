import { useState, useCallback } from 'react';
import { useWeb3 } from './useWeb3';

interface RequestOrderData {
  serviceId: number;
  objQuestions: string[];
  subjQuestions: string[];
  objWeights: number[];
  subjWeights: number[];
}

interface RequestOrderState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  transactionHash: string | null;
  orderId: string | null;
}

export const useRequestOrder = () => {
  const { getContract, isConnected } = useWeb3();
  const [state, setState] = useState<RequestOrderState>({
    isLoading: false,
    isSuccess: false,
    error: null,
    transactionHash: null,
    orderId: null,
  });

  const requestOrder = useCallback(async (orderData: RequestOrderData) => {
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
        orderId: null,
      });

      const contract = getContract();
      if (!contract) {
        throw new Error("Contract not initialized");
      }
      
      const tx = await contract.requestOrder(
        orderData.serviceId,
        orderData.objQuestions,
        orderData.subjQuestions,
        orderData.objWeights,
        orderData.subjWeights
      );

      setState(prev => ({
        ...prev,
        transactionHash: tx.hash,
      }));

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        const orderRequestedEvent = receipt.events?.find(
          (event: any) => event.event === 'OrderRequested'
        );
        
        const newOrderId = orderRequestedEvent?.args?.orderId.toString() || null;

        setState(prev => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
          orderId: newOrderId,
        }));
        
        return { orderId: newOrderId, transactionHash: tx.hash };
      } else {
        throw new Error('Transaction failed');
      }
    } catch (err: any) {
      console.error('Error requesting order:', err);
      
      let errorMessage = 'Failed to request order';
      if (err.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction rejected by user';
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
      orderId: null,
    });
  }, []);

  return {
    requestOrder,
    reset,
    ...state,
  };
}; 