pragma solidity ^0.8.20;

contract ServiceRegistry {
    struct Agent {
        uint id;
        string name;
        string bio;
        string imageURI;
        string contact;
        address owner;
    }

    struct Service {
        string description;
        string outputURI;
        string inputSpecsURI;
        string outputSpecsURI;
        uint price;
        uint completedServices;
        uint failedServices;
        uint totReviews;
        uint reputation; // sum of all review scores (for this service)
        uint agentId;
    }

    uint public agentCounter;
    uint public serviceCounter;

    mapping(address => uint) public ownerAgentCounter; // counts the number of agents an address has
    mapping(uint => Agent) public idToAgent;       // agentId to agents
    mapping(uint => Service) public idToService;     // serviceId to services
    mapping(uint => uint) internal agentServicesCounter;     // agentId to number of services that agent has

    event AgentCreated(uint indexed agentId, address indexed owner);
    event ServiceCreated(uint indexed serviceId, uint indexed agentId);
    event AgentTransferred(uint indexed agentId, address indexed previousOwner, address indexed newOwner);
    event AgentDeleted(uint indexed agentId, address indexed owner);
    event ServiceDeleted(uint indexed serviceId, uint indexed agentId, address indexed owner);

    modifier onlyAgentOwner(uint agentId) {
        require(
            idToAgent[agentId].owner == msg.sender,
            "Not the owner of the agent"
        );
        _;
    }
    
    modifier onlyServiceOwner(uint serviceId) {
        require(
            idToAgent[idToService[serviceId].agentId].owner == msg.sender,
            "Not the owner of the service"
        );
        _;
    }

    function createAgent(
        string calldata name,
        string calldata bio,
        string calldata imageURI,
        string calldata contact
    ) external {
      // It's ok for an address to own multiple agents
        uint agentId = agentCounter;
        agentCounter++;

        idToAgent[agentId] = Agent({
            id: agentId,
            name: name,
            bio: bio,
            imageURI: imageURI,
            contact: contact,
            owner: msg.sender
        });
        ownerAgentCounter[msg.sender]++;

        emit AgentCreated(agentId, msg.sender);
    }

    function getAgentServices(uint agentId) public view returns (uint[] memory) {
      uint[] memory result  = new uint[](agentServicesCounter[agentId]);

      uint count = 0;
      for (uint i = 0; i < serviceCounter; i++) {
        if (idToService[i].agentId == agentId) {
          result[count] = i;
          count++;
        }
      }

      return result;
    }

    function getAgentsByOwner(address owner) external view returns(uint[] memory) {
      uint[] memory result = new uint[](ownerAgentCounter[owner]);

      uint counter = 0;
      for (uint i = 0; i < agentCounter; i++) {
        if (idToAgent[i].owner == owner) {
          result[counter] = i;
          counter++;
        }
      }

      return result;
    }

    function createService(
        uint agentId,
        string calldata description,
        string calldata outputURI,
        string calldata inputSpecsURI,
        string calldata outputSpecsURI,
        uint price
    ) external onlyAgentOwner(agentId) {
        uint serviceId = serviceCounter;

        idToService[serviceId] = Service({
            description: description,
            outputURI: outputURI,
            inputSpecsURI: inputSpecsURI,
            outputSpecsURI: outputSpecsURI,
            price: price,
            completedServices: 0,
            failedServices: 0,
            totReviews: 0,
            reputation: 0,
            agentId: agentId
        });
        serviceCounter++;
        agentServicesCounter[agentId]++;

        emit ServiceCreated(serviceId, agentId);
    }

    function transferAgent(address newOwner, uint agentId) external onlyAgentOwner(agentId) {
      address previousOwner = idToAgent[agentId].owner;

      ownerAgentCounter[msg.sender]--;
      idToAgent[agentId].owner = newOwner;
      ownerAgentCounter[newOwner]++;

      emit AgentTransferred(agentId, previousOwner, newOwner);
    }

    function deleteAgent(uint agentId) external onlyAgentOwner(agentId) {
      require(getAgentServices(agentId).length == 0, "This agent has still some services, delete them");
      address owner = idToAgent[agentId].owner;

      delete idToAgent[agentId];
      ownerAgentCounter[msg.sender]--;

      emit AgentDeleted(agentId, owner);
    }

    function deleteService(uint serviceId) external onlyServiceOwner(serviceId) {
        uint agentId = idToService[serviceId].agentId;
        address owner = idToAgent[agentId].owner;

        delete idToService[serviceId];

        emit ServiceDeleted(serviceId, agentId, owner);
    }
}
