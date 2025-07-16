export const TESSERACT_CONTRACT_ADDRESS = "0xA15BB66138824a1c7167f5E85b957d04Dd34E468";

export const TESSERACT_CONTRACT_ABI = [
  {
    "type": "constructor",
    "inputs": [{"name": "initialOwner", "type": "address", "internalType": "address"}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "agentCounter",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "createAgent",
    "inputs": [
      {"name": "name", "type": "string", "internalType": "string"},
      {"name": "bio", "type": "string", "internalType": "string"},
      {"name": "imageURI", "type": "string", "internalType": "string"},
      {"name": "contact", "type": "string", "internalType": "string"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createService",
    "inputs": [
      {"name": "agentId", "type": "uint256", "internalType": "uint256"},
      {"name": "description", "type": "string", "internalType": "string"},
      {"name": "outputURI", "type": "string", "internalType": "string"},
      {"name": "inputSpecsURI", "type": "string", "internalType": "string"},
      {"name": "outputSpecsURI", "type": "string", "internalType": "string"},
      {"name": "price", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deleteAgent",
    "inputs": [{"name": "agentId", "type": "uint256", "internalType": "uint256"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deleteService",
    "inputs": [{"name": "serviceId", "type": "uint256", "internalType": "uint256"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAgentServices",
    "inputs": [{"name": "agentId", "type": "uint256", "internalType": "uint256"}],
    "outputs": [{"name": "", "type": "uint256[]", "internalType": "uint256[]"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAgentsByOwner",
    "inputs": [{"name": "owner", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "uint256[]", "internalType": "uint256[]"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "idToAgent",
    "inputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "outputs": [
      {"name": "id", "type": "uint256", "internalType": "uint256"},
      {"name": "name", "type": "string", "internalType": "string"},
      {"name": "bio", "type": "string", "internalType": "string"},
      {"name": "imageURI", "type": "string", "internalType": "string"},
      {"name": "contact", "type": "string", "internalType": "string"},
      {"name": "owner", "type": "address", "internalType": "address"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "idToService",
    "inputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "outputs": [
      {"name": "description", "type": "string", "internalType": "string"},
      {"name": "outputURI", "type": "string", "internalType": "string"},
      {"name": "inputSpecsURI", "type": "string", "internalType": "string"},
      {"name": "outputSpecsURI", "type": "string", "internalType": "string"},
      {"name": "price", "type": "uint256", "internalType": "uint256"},
      {"name": "completedServices", "type": "uint256", "internalType": "uint256"},
      {"name": "failedServices", "type": "uint256", "internalType": "uint256"},
      {"name": "totReviews", "type": "uint256", "internalType": "uint256"},
      {"name": "reputation", "type": "uint256", "internalType": "uint256"},
      {"name": "agentId", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownerAgentCounter",
    "inputs": [{"name": "", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "serviceCounter",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferAgent",
    "inputs": [
      {"name": "newOwner", "type": "address", "internalType": "address"},
      {"name": "agentId", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [{"name": "newOwner", "type": "address", "internalType": "address"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AgentCreated",
    "inputs": [
      {"name": "agentId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "owner", "type": "address", "indexed": true, "internalType": "address"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AgentDeleted",
    "inputs": [
      {"name": "agentId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "owner", "type": "address", "indexed": true, "internalType": "address"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AgentTransferred",
    "inputs": [
      {"name": "agentId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "previousOwner", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "newOwner", "type": "address", "indexed": true, "internalType": "address"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {"name": "previousOwner", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "newOwner", "type": "address", "indexed": true, "internalType": "address"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ServiceCreated",
    "inputs": [
      {"name": "serviceId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "agentId", "type": "uint256", "indexed": true, "internalType": "uint256"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ServiceDeleted",
    "inputs": [
      {"name": "serviceId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "agentId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "owner", "type": "address", "indexed": true, "internalType": "address"}
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [{"name": "owner", "type": "address", "internalType": "address"}]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [{"name": "account", "type": "address", "internalType": "address"}]
  }
];

export const LOCAL_RPC_URL = "http://localhost:3002"; 