pragma solidity ^0.8.0;


contract RegisterUser{
    struct User {
        string username;
        address walletAddress;
    }

    mapping(address => User) private users;

    function register(string memory _username) public {
        require(bytes(_username).length > 0, "Invalid username");
        require(users[msg.sender].walletAddress == address(0), "User already registered");

        users[msg.sender] = User(_username, msg.sender);
    }

    function getUser(address _walletAddress) public view returns (string memory) {
        require(users[_walletAddress].walletAddress != address(0), "User not found");
        return users[_walletAddress].username;
    }
}