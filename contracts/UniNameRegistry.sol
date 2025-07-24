// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title UniNameRegistry
 * @dev A decentralized naming system for Web3 identities
 */
contract UniNameRegistry is Ownable, ReentrancyGuard {
    
    // Events
    event NameRegistered(string indexed name, address indexed owner, address wallet);
    
    // Struct to store name information
    struct NameRecord {
        address owner;
        address defaultWallet;
        uint256 registrationTime;
        bool active;
    }
    
    // Mappings
    mapping(string => NameRecord) public names;
    mapping(string => bool) public nameExists;
    
    // Configuration
    uint256 public registrationFee = 0.001 ether; // Small fee for testnet
    
    /**
     * @dev Constructor
     */
    constructor() {}
    
    /**
     * @dev Register a new name (placeholder - will implement fully later)
     */
    function registerName(string memory name, address wallet) external payable {
        require(msg.value >= registrationFee, "Insufficient fee");
        require(!nameExists[name], "Name already exists");
        require(bytes(name).length >= 3, "Name too short");
        
        // TODO: Implement full registration logic
        nameExists[name] = true;
        
        emit NameRegistered(name, msg.sender, wallet);
    }
    
    /**
     * @dev Resolve name to wallet address (placeholder)
     */
    function resolveName(string memory name) external view returns (address) {
        require(nameExists[name], "Name does not exist");
        
        // TODO: Implement full resolution logic
        return address(0);
    }
}