pragma solidity ^0.8.20;

import "./ServiceRegistry.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Tesseract is Ownable, ServiceRegistry {
    constructor(address initialOwner) Ownable(initialOwner) {}
}
