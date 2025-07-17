import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from './useWeb3';
import { useAgents } from './useAgents';
import { ethers } from 'ethers';

// Define the structure of an Order for creations
export interface Order {
  id: string;
  serviceId: string;
  buyer: string;
  inputURI: string;
  outputURI: string;
  price: string;
  status: number;
  agentName: string;
}

// Enum to match the contract's Status enum
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

export const useMyCreations = () => {
  const { getContract, address } = useWeb3();
  const { agents } = useAgents();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreationsOrders = useCallback(async () => {
    if (!address) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = getContract();
      if (!contract) throw new Error("Contract not initialized");

      // Find agents created by the connected wallet
      const myAgents = agents.filter(agent => 
        agent.owner.toLowerCase() === address.toLowerCase()
      );

      if (myAgents.length === 0) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      // Get all agent IDs for this wallet
      const myAgentIds = myAgents.map(agent => agent.id);

      // Fetch all orders and filter for orders related to my agents
      const orderCounter = await contract.orderCounter();
      const orderCount = parseInt(orderCounter.toString());
      
      const myCreationsOrders: Order[] = [];

      for (let i = 0; i < orderCount; i++) {
        try {
          const orderData = await contract.idToOrder(i);
          const service = await contract.idToService(orderData.serviceId);

          // Check if this order is for one of my agents
          if (myAgentIds.includes(service.agentId.toString())) {
            const agent = myAgents.find(a => a.id === service.agentId.toString());
            
            myCreationsOrders.push({
              id: orderData.id.toString(),
              serviceId: orderData.serviceId.toString(),
              buyer: orderData.buyer,
              inputURI: orderData.inputURI,
              outputURI: orderData.outputURI,
              price: ethers.utils.formatEther(orderData.price),
              status: orderData.status,
              agentName: agent?.name || 'Unknown Agent',
            });
          }
        } catch (e) {
          console.warn(`Could not fetch order ${i}, it may have been deleted or have missing associations.`);
        }
      }

      setOrders(myCreationsOrders);
    } catch (err: any) {
      console.error('Error fetching creations orders:', err);
      const reason = err.reason || (err.data ? ethers.utils.toUtf8String(err.data) : null) || err.message || 'An unknown error occurred.';
      console.error('Contract revert reason:', reason);
      setError(`Failed to fetch your creations orders. Reason: ${reason}`);
    } finally {
      setIsLoading(false);
    }
  }, [getContract, address, agents]);

  useEffect(() => {
    fetchCreationsOrders();
  }, [fetchCreationsOrders]);

  return { orders, isLoading, error, refetch: fetchCreationsOrders };
}; 