pragma solidity ^0.8.28;

contract StorageContract {
    // Mapping to store data for each address
    mapping(address => string) private userData;

    event DataSaved(address indexed user, string data);
    event DataRetrieved(address indexed user, string data);
    event DataUpdated(address indexed user, string newData);

    // Function to save a string for the caller's address
    function saveData(string calldata _data) external {
        require(bytes(_data).length > 0, "Data cannot be empty");
        userData[msg.sender] = _data;
        emit DataSaved(msg.sender, _data);
    }

    // Function to retrieve the saved string for the caller's address
    function getData() external view returns (string memory) {
        return userData[msg.sender];
    }

    // Function to update the saved string for the caller's address
    function updateData(string calldata _newData) external {
        require(bytes(_newData).length > 0, "New data cannot be empty");
        require(bytes(userData[msg.sender]).length > 0, "No data exists to update");
        userData[msg.sender] = _newData;
        emit DataUpdated(msg.sender, _newData);
    }
}