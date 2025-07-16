import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getTesseractContract, sepoliaProvider } from '../web3';
import type { Agent } from '../web3';

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const contract = getTesseractContract(sepoliaProvider);
      
      // Get total agent count
      const agentCount = await contract.agentCounter();
      const count = agentCount.toNumber();

      if (count === 0) {
        setAgents([]);
        setIsLoading(false);
        return;
      }

      // Fetch all agents
      const agentPromises = [];
      for (let i = 1; i <= count; i++) {
        agentPromises.push(contract.idToAgent(i));
      }

      const agentResults = await Promise.all(agentPromises);
      
      const formattedAgents: Agent[] = agentResults.map((agent, index) => ({
        id: (index + 1).toString(),
        name: agent.name,
        bio: agent.bio,
        imageURI: agent.imageURI,
        contact: agent.contact,
        owner: agent.owner,
      }));

      setAgents(formattedAgents);
    } catch (err: any) {
      console.error('Error fetching agents:', err);
      setError(err.message || 'Failed to fetch agents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    isLoading,
    error,
    refetch: fetchAgents,
  };
};

export const useAgent = (agentId: string) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgent = useCallback(async () => {
    if (!agentId) return;

    try {
      setIsLoading(true);
      setError(null);

      const contract = getTesseractContract(sepoliaProvider);
      const agentData = await contract.idToAgent(agentId);

      const formattedAgent: Agent = {
        id: agentId,
        name: agentData.name,
        bio: agentData.bio,
        imageURI: agentData.imageURI,
        contact: agentData.contact,
        owner: agentData.owner,
      };

      setAgent(formattedAgent);
    } catch (err: any) {
      console.error('Error fetching agent:', err);
      setError(err.message || 'Failed to fetch agent');
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchAgent();
  }, [fetchAgent]);

  return {
    agent,
    isLoading,
    error,
    refetch: fetchAgent,
  };
};

export const useUserAgents = (userAddress: string | null) => {
  const [userAgents, setUserAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserAgents = useCallback(async () => {
    if (!userAddress) {
      setUserAgents([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const contract = getTesseractContract(sepoliaProvider);
      
      // Get agent IDs owned by user
      const agentIds = await contract.getAgentsByOwner(userAddress);
      
      if (agentIds.length === 0) {
        setUserAgents([]);
        setIsLoading(false);
        return;
      }

      // Fetch details for each agent
      const agentPromises = agentIds.map((id: ethers.BigNumber) => 
        contract.idToAgent(id.toNumber())
      );

      const agentResults = await Promise.all(agentPromises);
      
      const formattedAgents: Agent[] = agentResults.map((agent, index) => ({
        id: agentIds[index].toString(),
        name: agent.name,
        bio: agent.bio,
        imageURI: agent.imageURI,
        contact: agent.contact,
        owner: agent.owner,
      }));

      setUserAgents(formattedAgents);
    } catch (err: any) {
      console.error('Error fetching user agents:', err);
      setError(err.message || 'Failed to fetch user agents');
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
    fetchUserAgents();
  }, [fetchUserAgents]);

  return {
    userAgents,
    isLoading,
    error,
    refetch: fetchUserAgents,
  };
}; 