import { useState, useCallback } from 'react';
import { useWeb3 } from './useWeb3';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

export const usePayForOrder = () => {
  const { getContract } = useWeb3();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payForOrder = useCallback(async (orderId: string, price: string, reviewDeposit: string, disputeOrderEvaluationFee: string, disputeReviewFee: string, inputURI: string) => {
    setIsPaying(true);
    setError(null);
    const toastId = toast.loading('Processing payment...');
    try {
      const contract = getContract();
      if (!contract) throw new Error('Contract not initialized');
      const total = ethers.utils.parseEther(price)
        .add(ethers.utils.parseEther(reviewDeposit))
        .add(ethers.utils.parseEther(disputeOrderEvaluationFee))
        .add(ethers.utils.parseEther(disputeReviewFee));
      const tx = await contract.createOrder(orderId, inputURI, { value: total });
      await tx.wait();
      toast.success('Payment successful! Your order is being processed.', { id: toastId });
    } catch (err: any) {
      console.error('Error paying for order:', err);
      const errorMessage = err.reason || err.message || 'An unknown error occurred.';
      toast.error(`Payment failed: ${errorMessage}`, { id: toastId });
      setError(errorMessage);
    } finally {
      setIsPaying(false);
    }
  }, [getContract]);

  return { payForOrder, isPaying, error };
}; 