import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';
import { Agent } from '../web3';

export interface AgentWithPrice extends Agent {
  price?: string;
}

export const useAgents = () => {
  const { getContract, isConnected } = useWeb3();
  const [agents, setAgents] = useState<AgentWithPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    if (!isConnected) {
        setIsLoading(false);
        return;
      }

    setIsLoading(true);
    setError(null);

    try {
      const contract = getContract();
      if (!contract) {
        throw new Error("Contract not initialized");
      }

      console.log('Fetching agents from contract at:', contract.address); // DEBUG LOG

      const agentCounter = await contract.agentCounter();
      const agentCount = parseInt(agentCounter.toString());
      
      console.log('Agent counter from contract:', agentCount); // DEBUG LOG

      const agentsList: AgentWithPrice[] = [];

      for (let i = 0; i < agentCount; i++) {
        try {
          const agentData = await contract.idToAgent(i);
          console.log(`Agent ${i} data:`, agentData); // DEBUG LOG
          
          if (agentData.owner !== ethers.constants.AddressZero) {
            const agent: AgentWithPrice = {
              id: agentData.id.toString(),
              name: agentData.name,
              bio: agentData.bio,
              imageURI: agentData.imageURI,
              contact: agentData.contact,
              owner: agentData.owner,
            };

            const serviceIds = await contract.getAgentServices(agent.id);
            if (serviceIds && serviceIds.length > 0) {
              const firstService = await contract.idToService(serviceIds[0]);
              agent.price = ethers.utils.formatEther(firstService.price);
            }

            agentsList.push(agent);
          }
        } catch (e) {
          console.warn(`Could not fetch agent with ID ${i}, it might have been deleted.`, e);
        }
      }

      console.log('Final agents list:', agentsList); // DEBUG LOG
      setAgents(agentsList);
    } catch (err: any) {
      console.error('Error fetching agents:', err);
      let errorMessage = 'Failed to fetch agents. Please refresh the page.';
      if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [getContract, isConnected]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return { agents, isLoading, error, refetch: fetchAgents };
};

export const useAgent = (agentId: string | null) => {
  const { getContract, isConnected } = useWeb3();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgent = useCallback(async () => {
    if (!isConnected || !agentId) {
      setIsLoading(false);
      return;
    }

      setIsLoading(true);
      setError(null);

    try {
      const contract = getContract();
      if (!contract) {
        throw new Error("Contract not initialized");
      }
      const agentData = await contract.idToAgent(agentId);

      if (agentData.owner === ethers.constants.AddressZero) {
        throw new Error('Agent not found.');
      }

      setAgent({
        id: agentData.id.toString(),
        name: agentData.name,
        bio: agentData.bio,
        imageURI: agentData.imageURI,
        contact: agentData.contact,
        owner: agentData.owner,
      });
    } catch (err: any) {
      console.error(`Error fetching agent ${agentId}:`, err);
      setError('Failed to fetch agent details.');
    } finally {
      setIsLoading(false);
    }
  }, [getContract, isConnected, agentId]);

  useEffect(() => {
    fetchAgent();
  }, [fetchAgent]);

  return { agent, isLoading, error, refetch: fetchAgent };
}; 