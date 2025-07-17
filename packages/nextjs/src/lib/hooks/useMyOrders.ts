import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from './useWeb3';
import { ethers } from 'ethers';

// Define the structure of an Order, based on the smart contract
export interface Order {
  id: string;
  serviceId: string;
  buyer: string;
  inputURI: string;
  outputURI: string;
  price: string;
  status: number;
  agentName: string; // We'll enrich the order with the agent's name
}

// Enum to match the contract's Status enum for readability
export enum OrderStatus {
  Requested,
  Accepted,
  Rejected,
  Created,
  Delivered,
  Complete,
  Uncomplete,
  EvaluatedUncomplete,
  EvaluationDisputed,
  JustReviewed,
  ReviewDisputed,
  Reviewed
}

export const useMyOrders = () => {
  const { getContract, address } = useWeb3();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = getContract();
      if (!contract) throw new Error("Contract not initialized");

      const orderCounter = await contract.orderCounter();
      const orderCount = parseInt(orderCounter.toString());
      
      const myOrders: Order[] = [];

      for (let i = 0; i < orderCount; i++) {
        try {
          const orderData = await contract.idToOrder(i);
          if (orderData.buyer === address) {
            const service = await contract.idToService(orderData.serviceId);
            const agent = await contract.idToAgent(service.agentId);

            myOrders.push({
              id: orderData.id.toString(),
              serviceId: orderData.serviceId.toString(),
              buyer: orderData.buyer,
              inputURI: orderData.inputURI,
              outputURI: orderData.outputURI,
              price: ethers.utils.formatEther(orderData.price),
              status: orderData.status,
              agentName: agent.name,
            });
          }
        } catch (e) {
          console.warn(`Could not fetch order ${i}, it may have been deleted or have missing associations.`);
        }
      }

      setOrders(myOrders);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      const reason = err.reason || (err.data ? ethers.utils.toUtf8String(err.data) : null) || err.message || 'An unknown error occurred.';
      console.error('Contract revert reason:', reason);
      setError(`Failed to fetch your orders. Reason: ${reason}`);
    } finally {
      setIsLoading(false);
    }
  }, [getContract, address]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading, error, refetch: fetchOrders };
}; 