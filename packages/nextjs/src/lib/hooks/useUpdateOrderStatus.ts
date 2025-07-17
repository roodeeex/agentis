import { useState, useCallback } from 'react';
import { useWeb3 } from './useWeb3';
import { toast } from 'react-hot-toast';
import { OrderStatus } from './useMyOrders';

export const useUpdateOrderStatus = () => {
  const { getContract, address } = useWeb3();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    if (!address) {
      toast.error("Please connect your wallet first.");
      return;
    }
     if (!getContract) {
        toast.error("Contract not initialized.");
        return;
    }

    setIsUpdating(true);
    setError(null);
    const toastId = toast.loading('Updating order status...');

    try {
      const contract = getContract();
       if (!contract) throw new Error("Contract not initialized");

      const tx = await contract.updateOrderStatus(orderId, newStatus);
      await tx.wait();

      toast.success('Order status updated successfully!', { id: toastId });
    } catch (err: any) {
      console.error('Error updating order status:', err);
      const errorMessage = err.reason || err.message || 'An unknown error occurred.';
      toast.error(`Update failed: ${errorMessage}`, { id: toastId });
      setError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [getContract, address]);

  return { updateOrderStatus, isUpdating, error };
}; 