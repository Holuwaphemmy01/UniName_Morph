 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract PaymentContract {
    event PaymentSent(address indexed sender, address indexed admin, uint256 amount);

    // Function to send payment to specified admin address
    function sendPayment(uint256 _amount, address _admin) external payable {
        require(_amount > 0, "Amount must be greater than zero");
        require(msg.value == _amount, "Sent value must match specified amount");
        require(_admin != address(0), "Admin address cannot be zero");

        // Transfer the amount to the admin
        (bool success, ) = _admin.call{value: _amount}("");
        require(success, "Payment transfer failed");

        emit PaymentSent(msg.sender, _admin, _amount);
    }

    // Fallback function to prevent accidental ETH deposits
    receive() external payable {
        revert("Direct ETH deposits not allowed");
    }
}