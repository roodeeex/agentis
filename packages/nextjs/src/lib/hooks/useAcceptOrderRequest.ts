import { useState, useCallback } from 'react';
import { useWeb3 } from './useWeb3';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

export const useAcceptOrderRequest = () => {
  const { getContract, address } = useWeb3();
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptOrderRequest = useCallback(async (orderId: string, disputeOrderEvaluationFee: string, disputeReviewFee: string) => {
    setIsAccepting(true);
    setError(null);
    const toastId = toast.loading('Accepting order request...');
    try {
      const contract = getContract();
      if (!contract) throw new Error('Contract not initialized');
      const value = ethers.utils.parseEther(disputeOrderEvaluationFee).add(ethers.utils.parseEther(disputeReviewFee));
      const tx = await contract.evaluateOrderRequest(orderId, true, { value });
      await tx.wait();
      toast.success('Order request accepted!', { id: toastId });
    } catch (err: any) {
      console.error('Error accepting order request:', err);
      const errorMessage = err.reason || err.message || 'An unknown error occurred.';
      toast.error(`Accept failed: ${errorMessage}`, { id: toastId });
      setError(errorMessage);
    } finally {
      setIsAccepting(false);
    }
  }, [getContract]);

  return { acceptOrderRequest, isAccepting, error };
}; 